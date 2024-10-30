import { URI } from "./constant";

function getWindow() {
    if (typeof window !== "undefined") return window;
    return null;
}

function joinURL(base, path) {
    const {
        location: { hostname },
    } = getWindow() ?? { location: {} };

    // Asegurarte de que el path no empiece con "/"
    if (path.startsWith("/")) path = path.slice(1);

    // Crear la URL completa
    let fullUrl = `${base?.replace(/\/$/, "")}/${path}`;

    // Si es producción, reemplazar el esquema con "https"
    if (hostname !== "localhost")
        fullUrl = fullUrl?.replace(/^http:\/\//, "https://");

    return fullUrl;
}

export function getURL(url = "") {
    const result = joinURL(URI.FORM, url);
    return result;
}

export const format = (template, values) => {
    const validValues = values.every(
        (value) => value !== undefined && value !== null && value !== "",
    );

    if (!validValues) return null;

    return template.replace(/\$(\d+)/g, (match, index) => values[index - 1]);
};
