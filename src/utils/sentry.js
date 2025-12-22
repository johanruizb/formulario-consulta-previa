/**
 * Utilidades para integración con Sentry
 * Proporciona funciones para serializar datos de formularios de manera segura
 * excluyendo archivos binarios y manteniendo solo metadata
 */

/**
 * Serializa datos de formulario para envío a Sentry
 * Reemplaza objetos File por metadata {name, size}
 *
 * @param {Object} formData - Datos del formulario a serializar
 * @returns {Object} Datos serializados sin binarios
 */
export function serializeFormDataForSentry(formData) {
    const serialized = {};

    for (const [key, value] of Object.entries(formData)) {
        // Si es un File object, extraer solo metadata
        if (value instanceof File) {
            serialized[key] = {
                name: value.name,
                size: value.size,
                type: value.type,
                lastModified: value.lastModified,
            };
        }
        // Si es un array, procesarlo recursivamente
        else if (Array.isArray(value)) {
            serialized[key] = value.map((item) =>
                item instanceof File
                    ? {
                          name: item.name,
                          size: item.size,
                          type: item.type,
                          lastModified: item.lastModified,
                      }
                    : item,
            );
        }
        // Otros valores se copian directamente
        else {
            serialized[key] = value;
        }
    }

    return serialized;
}

/**
 * Calcula el tamaño total de un FormData
 * Útil para agregar como metadata en Sentry
 *
 * @param {Object} formData - Datos del formulario
 * @returns {number} Tamaño estimado en bytes
 */
export function calculateFormDataSize(formData) {
    let totalSize = 0;

    for (const value of Object.values(formData)) {
        if (value instanceof File) {
            totalSize += value.size;
        } else if (typeof value === "string") {
            // Estimación: cada caracter es ~2 bytes en UTF-16
            totalSize += value.length * 2;
        } else if (Array.isArray(value)) {
            // Recursivo para arrays
            value.forEach((item) => {
                if (item instanceof File) {
                    totalSize += item.size;
                } else if (typeof item === "string") {
                    totalSize += item.length * 2;
                }
            });
        }
    }

    return totalSize;
}

/**
 * Formatea bytes a formato legible (KB, MB)
 *
 * @param {number} bytes - Tamaño en bytes
 * @returns {string} Tamaño formateado
 */
export function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
