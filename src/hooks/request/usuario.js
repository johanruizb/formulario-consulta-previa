import { URI } from "../../components/constant";

const url = URI.API.replace("/v1", "") + "/usuarios";

const USUARIO = {
    /**
     * Registra un log enviando los datos al servidor.
     *
     * @param {FormData} data - Los datos del log.
     * @returns {Promise<Response>} - Una promesa que se resuelve con la respuesta del servidor.
     */
    registrarLog: (content, severity = "info") =>
        fetch(url + "/log", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, severity }),
        }),
};
export default USUARIO;
