import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";

/**
 * Componente reutilizable para mostrar un backdrop de carga
 * @param {boolean} open - Controla la visibilidad del backdrop
 * @param {object} sx - Estilos personalizados adicionales
 */
export default function LoadingBackdrop({ open = true, sx = {} }) {
    return (
        <Backdrop
            open={open}
            sx={{
                bgcolor: "transparent",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                ...sx,
            }}
        >
            <CircularProgress />
        </Backdrop>
    );
}

LoadingBackdrop.propTypes = {
    open: PropTypes.bool,
    sx: PropTypes.object,
};
