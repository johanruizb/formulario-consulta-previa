// React
import React from 'react'
import {Grid2, Box, Button} from '@mui/material'
import styles from './styles.js'
import Formularios from "./constant";
import { onSubmit } from './functions'

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

const COURSE_AVALAIBLES = ['diplomado']

/**
 * 
 * Validate If user have data 
 */
export default function ValidateInfoData({ curso, Banner }) {
    // Use State
    const [open, setOpen] = React.useState(false)
    const [isSucess, setIsSucess] = React.useState(false)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [text, setText] = React.useState("")
    const [showPreview, setShowPreview] = React.useState(COURSE_AVALAIBLES.includes(curso));

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
        setShowPreview: setShowPreview
    }

    const optionDialog = {
        open: openDialog,
        setOpen: setOpenDialog,
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

  const handleClick = () => {
    setOpen(true);
  };

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


function AlertDialog({ open, setOpen}) {

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              Hemos encontrado un registro de tu información de otro curso. 
              ¿Te gustaría inscribirte en el diplomado y continuar tu aprendizaje?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>Rechazar</Button>
          <Button>
             Registrarse
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
