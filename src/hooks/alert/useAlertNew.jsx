import { useContext } from "react";
import AlertContext from "../../contexts/AlertContext";

/**
 * Hook para usar el contexto de alertas
 * @returns {{alert: object|null, showAlert: function, hideAlert: function}}
 */
export function useAlert() {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error("useAlert debe usarse dentro de AlertProvider");
    }

    return context;
}

export default useAlert;
