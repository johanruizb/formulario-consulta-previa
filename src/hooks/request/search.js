import { URI } from "../../components/constant";

const url = URI.API.replace("/v1", "");

const getToken = () => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: "cristiank",
            password: "feny8uhjddsj90",
        }),
    };

    return fetch(`${url}/token/`, options);
};

const SEARCH_DOC = {
    /**
     * Registra un log enviando los datos al servidor.
     *
     * @param {FormData} data - Los datos del log.
     * @returns {Promise<Response>} - Una promesa que se resuelve con la respuesta del servidor.
     */
    existUser: async (num_doc) => {
        const token = await getToken();
        const response = await token.json();
        return fetch(url + `/usuarios/search/inscritos/${num_doc}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${response.access}`,
            },
        });
    },
    token: async () => {
        const token = await getToken();
        const response = await token.json();
        console.log(response);
    },
};
export default SEARCH_DOC;
