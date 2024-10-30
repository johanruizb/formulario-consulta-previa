import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Fragment } from "react";

function DialogMessage() {
    const [message, setMessage] = useLocalStorage("DialogMessage", null); // {message: "string", error: "boolean"}
    const onClose = () => setMessage(null);

    return (
        message && (
            <Dialog open>
                <DialogTitle
                    sx={{
                        display: "flex",
                        pr: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        sx={{
                            flex: 1,
                        }}
                    >
                        {message.error ? (
                            <ErrorIcon color="error" sx={{ mr: 1 }} />
                        ) : (
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        )}
                        {message.title ??
                            (message.error
                                ? "Algo ha salido mal"
                                : "El registro ha sido exitoso")}
                    </Stack>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={(theme) => ({
                            ml: 2,
                            color: theme.palette.grey[500],
                        })}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack>
                        <Typography align="center">
                            {message.message.split("\n").map((line, index) => (
                                <Fragment key={index}>
                                    {line}
                                    <br />
                                </Fragment>
                            ))}
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onClose} color="primary">
                        Listo
                    </Button>
                </DialogActions>
            </Dialog>
        )
    );
}

export default DialogMessage;
