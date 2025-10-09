import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSessionStorage } from "@uidotdev/usehooks";
import { Fragment } from "react";

function AlertDialog() {
    const [alert, setAlert] = useSessionStorage("DialogMessage", null);

    const onClose = () => {
        if (alert?.refreshOnAccept) window.location.reload();
        setAlert(null);
    };

    const onAccept = () => {
        if (alert?.refreshOnAccept) window.location.reload();
        onClose();
    };

    return (
        alert &&
        alert.message && (
            <Dialog
                open
                sx={{
                    zIndex: 99999,
                }}
            >
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
                        {alert?.error ? (
                            <ErrorIcon color="error" sx={{ mr: 1 }} />
                        ) : (
                            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        )}
                        {alert?.title ??
                            (alert?.error
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
                            {alert?.message?.split("\n").map((line, index) => (
                                <Fragment key={index}>
                                    {line
                                        .split(/(<strong>.*?<\/strong>)/g)
                                        .map((segment, segmentIndex) => {
                                            // Verificar si el segmento está entre etiquetas <strong>
                                            if (
                                                segment.startsWith(
                                                    "<strong>",
                                                ) &&
                                                segment.endsWith("</strong>")
                                            ) {
                                                const strongContent =
                                                    segment.slice(8, -9); // Eliminar <strong> y </strong>
                                                return (
                                                    <strong key={segmentIndex}>
                                                        {strongContent}
                                                    </strong>
                                                );
                                            }
                                            // Texto normal
                                            return segment;
                                        })}
                                    <br />
                                </Fragment>
                            ))}
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onAccept} color="primary">
                        Listo
                    </Button>
                </DialogActions>
            </Dialog>
        )
    );
}

export default AlertDialog;
