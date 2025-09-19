import dayjs from "dayjs";
import { useState } from "react";
import getTimeout from "../../utils/timeout";

/**
 * Hook personalizado para manejar el estado de carga.
 *
 * Este hook proporciona un estado de carga (`loading`) y dos funciones (`start` y `finish`)
 * para controlar el inicio y el fin de un proceso de carga. Es útil para mostrar indicadores
 * de carga en la interfaz de usuario mientras se realizan operaciones asíncronas.
 *
 * @returns {Object} Un objeto con las siguientes propiedades y funciones:
 * - loading: Booleano que indica si está en estado de carga.
 * - start: Función para iniciar el estado de carga. Establece `loading` en `true` y guarda el tiempo de inicio.
 * - finish: Función para finalizar el estado de carga y ejecutar una acción. Establece `loading` en `false` después de un tiempo calculado.
 */
function useLoading() {
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState();

    const start = (time) => {
        setLoading(true);
        setStartTime(time || dayjs());
    };

    const finish = (doSomething) => {
        setTimeout(() => {
            setLoading(false);
            doSomething();
        }, getTimeout(startTime));
    };

    return {
        loading,
        start,
        finish,
    };
}

export default useLoading;
