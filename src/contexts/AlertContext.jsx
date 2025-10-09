import { createContext, useCallback, useState } from "react";
import PropTypes from "prop-types";

/**
 * Context para manejar alertas globales de la aplicación
 * Reemplaza el uso de localStorage/sessionStorage
 */
const AlertContext = createContext(null);

/**
 * Provider de AlertContext
 */
export function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);

    /**
     * Muestra una alerta
     * @param {string} message - Mensaje a mostrar
     * @param {boolean} error - Si es un mensaje de error
     * @param {string} title - Título personalizado
     */
    const showAlert = useCallback(
        ({ message, error = false, title, refreshOnAccept = false }) => {
            setAlert({
                message,
                error,
                title:
                    title ||
                    (error
                        ? "Algo ha salido mal"
                        : "El registro ha sido exitoso"),
                refreshOnAccept,
            });
        },
        [],
    );

    /**
     * Oculta la alerta actual
     */
    const hideAlert = useCallback(() => {
        if (alert?.refreshOnAccept) window.location.reload();
        setAlert(null);
    }, [alert]);

    const value = {
        alert,
        showAlert,
        hideAlert,
    };

    return (
        <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
    );
}

AlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AlertContext;
