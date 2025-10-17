import WarningIcon from "@mui/icons-material/Warning";
import RefreshIcon from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

/**
 * Componente para mostrar estados de error de forma consistente
 * @param {object} error - Objeto de error con status y statusText
 * @param {boolean} isValidating - Indica si se está revalidando
 * @param {function} onRetry - Callback para reintentar
 * @param {string} title - Título personalizado del error
 * @param {string} message - Mensaje personalizado del error
 */
export default function ErrorState({
    error,
    isValidating = false,
    onRetry,
    title,
    message,
}) {
    const errorCode = error?.status || -1;
    const defaultTitle = `Error ${errorCode}`;
    const defaultMessage =
        "Lo sentimos, ha ocurrido un error inesperado en el servidor. Por favor, inténtalo de nuevo más tarde.";

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
                px: 2,
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1.25}>
                <Typography
                    textAlign="center"
                    fontFamily="monospace"
                    sx={{
                        fontWeight: "bold",
                        fontSize: 24,
                    }}
                >
                    {title || defaultTitle}
                </Typography>
                {isValidating ? (
                    <CircularProgress size={24} />
                ) : (
                    <WarningIcon
                        color="warning"
                        sx={{
                            fontSize: 24,
                        }}
                    />
                )}
            </Stack>
            <Typography textAlign="center" fontFamily="monospace">
                {message || defaultMessage}
            </Typography>
            {onRetry && !isValidating && (
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={onRetry}
                >
                    Reintentar
                </Button>
            )}
        </Stack>
    );
}

ErrorState.propTypes = {
    error: PropTypes.shape({
        status: PropTypes.number,
        statusText: PropTypes.string,
    }),
    isValidating: PropTypes.bool,
    onRetry: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string,
};
