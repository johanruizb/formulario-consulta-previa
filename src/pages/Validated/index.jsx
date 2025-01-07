// React
import React from 'react'
import {Grid2, Box, Button} from '@mui/material'
import styles from './styles.js'
import Formularios from "./constant";
import { onSubmit,initShow, registerUsuer } from './functions'

// Material IU
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';

// Material IU -- DIALOG
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Days
import dayjs from "dayjs";
import { Turnstile } from "@marsidev/react-turnstile";
import isProduction from "../../utils/isProduction";

// Hoosk
import { useLocalStorage } from "@uidotdev/usehooks";

// PropTypes
import PropTypes from "prop-types";

/**
 * 
 * Validate If user have data 
 */
export default function ValidateInfoData({ curso, Banner, onOpenAlert }) {
    // Use State
    const [open, setOpen] = React.useState(false)
    const [isSucess, setIsSucess] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [userFound, setUserFound] = React.useState(null)
    const [text, setText] = React.useState("")
    const [form] = useLoadForm();
    const [showPreview, setShowPreview] = React.useState(initShow(curso,form));

    // Use Ref
    const formRef = React.useRef({});

    // Validate
    if (!showPreview) return null

    const optionsSnackbar = {
        open: open,
        setOpen: setOpen,
        isSuccess: isSucess,
        setIsSucess: setIsSucess,
        textMenssage: text,
        setText: setText,
        setOpenDialog: setOpenDialog,
        setShowPreview: setShowPreview,
        setUserFound: setUserFound
    }

    const optionDialog = {
        open: openDialog,
        setOpen: setOpenDialog,
        submit: registerUsuer,
        data: userFound,
        curso: curso,
        onOpenAlert: onOpenAlert,
        ref: formRef,
        setUserFound: setUserFound
    }

    return (
        <React.Fragment>
            {showPreview && <Box sx={styles.containerPrimary}>
                <Box
                    component="img"
                    src={Banner}
                    alt="Banner"
                    sx={{
                        width: "100%",
                        pb: 1.25,
                    }}
                />
                <Box component="form" autoComplete="one-time-code" onSubmit={(e) => onSubmit(e,optionsSnackbar)}>
                    <Grid2 container spacing={1.25}>
                        {Formularios[curso]?.map((field, index) => {
                            const {
                                Component,
                                gridless = false,
                                size = { xs: 12, md: 6 },
                                // ...props
                            } = field;

                            if (!Component) return null;

                            return gridless ? (
                                <Component
                                    key={index}
                                    slotProps={{
                                        ...field,
                                        formRef,
                                    }}
                                />
                            ) : (
                                <Grid2 key={index} size={size}>
                                    <Component
                                        slotProps={{
                                            ...field,
                                            formRef,
                                        }}
                                    />
                                </Grid2>
                            );
                        })}
                    </Grid2>
                    <Button variant="contained" type="submit" disabled={open}> Encontrar </Button>
                </Box>
            </Box>}
            <SimpleSnackbar {...optionsSnackbar} />
            <AlertDialog {...optionDialog} />
        </React.Fragment>
    )
}

function SimpleSnackbar({ open, setOpen, isSuccess,textMenssage}) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        Close
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message=""
        action={action}
      >
        <Alert severity={isSuccess? 'success' : 'error'}>{textMenssage}</Alert>
      </Snackbar>
    </div>
  );
}


function AlertDialog({ open, setOpen, submit, data, curso, onOpenAlert, ref,setUserFound}) {
  const [disabled,setDisabled] = React.useState(true)

  const handleClose = () => {
    setOpen(false);
  };

  const handlerSubmit = async () => {
      setDisabled(true)
      await submit(data, curso, onOpenAlert)
      setTimeout(() => {
        setDisabled(false)
        setOpen(false);
      }, 2000);
  }

  const onSuccess = (token) => {
    data['turnstile_token'] = token
    setUserFound(data)
    setDisabled(false)
    //methods.setValue("turnstile_token", token);
  };

  const onExpire = () => {
    ref.current?.reset();
};

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Completa tu Inscripción al Diplomado"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              Hemos encontrado un registro de tu información de otro curso. 
              ¿Te gustaría inscribirte en el diplomado y continuar tu aprendizaje?
              <Grid2 size={12}>
                  <Box
                      component={Turnstile}
                      onSuccess={onSuccess}
                      onExpire={onExpire}
                      options={{
                          theme: "light",
                          refreshExpired: "manual",
                      }}
                      ref={ref}
                      label={`form_button_${window.location.hostname}`}
                      siteKey={
                          isProduction
                              ? "0x4AAAAAAAiIftnN7i8Mr-yd"
                              : "0x4AAAAAAAiIgbhjquURIMbK"
                      }
                      sx={{
                          mb: 2,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                      }}
                  />
              </Grid2>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>Rechazar</Button>
          <Button onClick={handlerSubmit} disabled={disabled}>
             Registrarse
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function useLoadForm() {
  const [form, saveForm] = useLocalStorage("form", {});

  const expires = form.expires ? dayjs(form.expires) : null;
  const isAfter = expires ? dayjs().isAfter(expires) : false;

  // Si expira el form, se limpia
  if (expires && isAfter) return [{}, saveForm];
  return [form.values, saveForm];
}

ValidateInfoData.propTypes = {
    curso: PropTypes.string,
    Banner: PropTypes.string, 
    onOpenAlert: PropTypes.func
}

SimpleSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  isSuccess: PropTypes.bool.isRequired, 
  textMenssage: PropTypes.string.isRequired,
};

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  data: PropTypes.object,
  curso: PropTypes.string.isRequired,
  onOpenAlert: PropTypes.func.isRequired, 
  ref: PropTypes.object.isRequired,
  setUserFound: PropTypes.func.isRequired,
};