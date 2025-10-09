import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

/**
 * Componente para mostrar mensajes informativos centrados
 * @param {string} title - Título del mensaje
 * @param {string} message - Mensaje a mostrar
 * @param {node} icon - Icono opcional a mostrar
 */
export default function MessageState({ title, message, icon }) {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
                px: 2,
            }}
        >
            {icon && icon}
            {title && (
                <Typography variant="h4" textAlign="center">
                    {title}
                </Typography>
            )}
            {message && (
                <Typography variant="h6" textAlign="center">
                    {message}
                </Typography>
            )}
        </Stack>
    );
}

MessageState.propTypes = {
    title: PropTypes.string,
    message: PropTypes.node,
    icon: PropTypes.node,
};
