import USUARIO from "./usuario";

const fetcher = (...args) =>
    fetch(...args)
        .then(async (res) => {
            const response = await res.json();

            if (res.ok) {
                return Promise.resolve(response);
            } else {
                const headers = {};
                for (const header of res.headers.entries())
                    headers[header[0]] = header[1];

                USUARIO.registrarLog(
                    {
                        headers,
                        ok: res.ok,
                        status: res.status,
                        statusText: res.statusText,
                        url: res.url,
                        response,
                    },
                    "warning",
                );
                return Promise.resolve({
                    status: res.status,
                    statusText: res.statusText,
                });
            }
        })
        .catch((error) => {
            console.error(error);
            const err = JSON.stringify(error);
            USUARIO.registrarLog(err, "error");
            return Promise.reject(error);
        });

export default fetcher;
