import { URI } from "../../components/constant";

const url = URI.API.replace("/v1", "");

const SEARCH = {
    verify: ({ documentNumber, turnstile_token }) =>
        fetch(url + "/usuarios/search/inscritos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ documentNumber, turnstile_token }),
        }),
};
export default SEARCH;
