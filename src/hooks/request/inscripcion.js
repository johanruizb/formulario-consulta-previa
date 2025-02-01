import { URI } from "../../components/constant";

const url = URI.API + "/inscripcion";

/**
 * Objeto INSCRIPCION que contiene métodos relacionados con la inscripción.
 */
const INSCRIPCION = {
    /**
     * Registra una nueva inscripción enviando los datos al servidor.
     *
     * @param {FormData} data - Los datos del formulario de inscripción.
     * @returns {Promise<Response>} - Una promesa que se resuelve con la respuesta del servidor.
     */
    registrar: (data) =>
        fetch(url + "/registrar", {
            method: "POST",
            body: data,
        }),
    espera: (data) =>
        fetch(url + "/espera", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        }),
};
export default INSCRIPCION;
