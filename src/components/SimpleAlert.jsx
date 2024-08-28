import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

export default function SimpleAlert({
    message,
    open,
    onClose,
    severity = "success",
    autoHideDuration = 6000,
}) {
    return (
        open && (
            <Snackbar
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={onClose}
            >
                <Alert
                    severity={severity}
                    onClose={onClose}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        )
    );
}

SimpleAlert.propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
    autoHideDuration: PropTypes.number,
};
