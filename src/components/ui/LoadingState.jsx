import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

/**
 * Componente para mostrar estado de carga centrado
 * @param {string} message - Mensaje opcional a mostrar
 * @param {number} size - Tamaño del CircularProgress
 */
export default function LoadingState({ message, size = 40 }) {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
            }}
        >
            <CircularProgress size={size} />
            {message && (
                <Typography variant="body1" color="text.secondary">
                    {message}
                </Typography>
            )}
        </Stack>
    );
}

LoadingState.propTypes = {
    message: PropTypes.string,
    size: PropTypes.number,
};
