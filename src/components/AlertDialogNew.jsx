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
import { Fragment } from "react";
import { useAlert } from "../hooks/alert/useAlertNew";

/**
 * Componente de diálogo de alerta global
 * Ahora usa AlertContext en lugar de sessionStorage
 */
function AlertDialog() {
    const { alert, hideAlert } = useAlert();

    if (!alert || !alert.message) return null;

    return (
        <Dialog
            open
            onClose={hideAlert}
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
                    {alert?.title}
                </Stack>
                <IconButton
                    aria-label="close"
                    onClick={hideAlert}
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
                                            segment.startsWith("<strong>") &&
                                            segment.endsWith("</strong>")
                                        ) {
                                            const strongContent = segment.slice(
                                                8,
                                                -9,
                                            );
                                            return (
                                                <strong key={segmentIndex}>
                                                    {strongContent}
                                                </strong>
                                            );
                                        }
                                        return segment;
                                    })}
                                <br />
                            </Fragment>
                        ))}
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={hideAlert} color="primary">
                    Listo
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;
