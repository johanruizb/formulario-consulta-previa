import { URI } from "../../components/constant";

const url = URI.API.replace("/v1", "");

const SEARCH = {
    verify: (data) =>
        fetch(url + "/usuarios/search/inscritos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }),
};
export default SEARCH;
