/**
 * Utilidades para manejo seguro de respuestas HTTP
 * Incluye parseo seguro de JSON y manejo unificado de errores con Sentry
 */

import * as Sentry from "@sentry/react";
import {
    calculateFormDataSize,
    formatBytes,
    serializeFormDataForSentry,
} from "./sentry";

/**
 * Verifica si el content-type indica una respuesta JSON
 * @param {string} contentType - Header content-type
 * @returns {boolean}
 */
function isJSONResponse(contentType) {
    return contentType?.includes("application/json") ?? false;
}

/**
 * Parsea una respuesta HTTP de forma segura
 * Lee el body como texto y luego intenta parsearlo como JSON si corresponde
 *
 * @param {Response} response - Respuesta fetch
 * @returns {Promise<Object>} Objeto con {ok, status, statusText, url, data, contentType, rawBody}
 */
export async function safeParseResponse(response) {
    const contentType = response.headers.get("content-type");
    const isJSON = isJSONResponse(contentType);

    // Siempre leer como texto primero (no se puede leer dos veces el body)
    let rawBody = "";
    try {
        rawBody = await response.text();
    } catch (error) {
        console.error("[HTTP] Error al leer response.text():", error);
    }

    // Detectar respuesta vacía
    const isEmpty = !rawBody || rawBody.trim().length === 0;

    // Intentar parsear como JSON si corresponde
    let data = null;
    if (isJSON && rawBody && !isEmpty) {
        try {
            data = JSON.parse(rawBody);
        } catch (error) {
            console.warn(
                "[HTTP] Content-Type indica JSON pero el parseo falló:",
                error.message,
            );
        }
    }

    return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data,
        contentType,
        isEmpty,
        // Solo incluir rawBody si NO es JSON válido (para debug de HTML/texto)
        rawBody: data ? null : rawBody,
    };
}

/**
 * Maneja errores HTTP en métodos onSubmit de formularios
 * Unifica lógica de breadcrumbs, Sentry y mensajes de error
 *
 * @param {Response} response - Respuesta HTTP con error
 * @param {Object} formData - Datos del formulario (sin binarios)
 * @param {Object} context - Contexto del error {category, formType, alreadyRegistered}
 * @returns {Promise<string>} Mensaje de error para mostrar al usuario
 */
export async function handleSubmitError(response, formData, context) {
    const {
        category = "form",
        formType = "unknown",
        alreadyRegistered = false,
    } = context;

    // Parsear respuesta de forma segura
    const parsed = await safeParseResponse(response);

    // Breadcrumb: error HTTP
    Sentry.addBreadcrumb({
        category,
        message: `Error HTTP ${parsed.status}`,
        level: "error",
        data: {
            status: parsed.status,
            statusText: parsed.statusText,
            contentType: parsed.contentType,
            hasJSON: !!parsed.data,
            isEmpty: parsed.isEmpty,
            hasRawBody: !!parsed.rawBody,
        },
    });

    // Determinar mensaje descriptivo según el código de estado
    let errorType = "http_error";
    let userMessage = parsed.data?.message;

    // Manejar respuestas vacías
    if (parsed.isEmpty) {
        errorType = "empty_response";
        userMessage =
            "El servidor no respondió correctamente. Por favor, intenta nuevamente.";
    } else if (!userMessage) {
        // Sin mensaje del servidor, generar uno según el código
        if (parsed.status >= 500) {
            errorType = "server_error";
            userMessage = `Error del servidor (${parsed.status}). Por favor, intenta nuevamente en unos momentos.`;
        } else if (parsed.status >= 400) {
            errorType = "client_error";
            userMessage = `Error en la solicitud (${parsed.status}). Por favor, verifica los datos e intenta nuevamente.`;
        } else {
            userMessage = `Error al registrarse (${parsed.status} - ${parsed.statusText})`;
        }
    }

    // Capturar error en Sentry con contexto completo
    const error = new Error(
        `Error HTTP ${parsed.status} en ${category}: ${parsed.statusText}`,
    );

    Sentry.captureException(error, {
        contexts: {
            formData: {
                ...serializeFormDataForSentry(formData),
                totalSize: formatBytes(calculateFormDataSize(formData)),
                alreadyRegistered,
            },
            response: {
                status: parsed.status,
                statusText: parsed.statusText,
                url: parsed.url,
                contentType: parsed.contentType,
                message: parsed.data?.message,
            },
            // Incluir body raw truncado si está disponible (HTML de error, etc)
            ...(parsed.rawBody && {
                rawResponse: {
                    preview: parsed.rawBody.substring(0, 2000),
                    truncated: parsed.rawBody.length > 2000,
                    fullLength: parsed.rawBody.length,
                },
            }),
        },
        tags: {
            form_type: formType,
            error_type: errorType,
            status_code: parsed.status.toString(),
            has_json_response: parsed.data ? "true" : "false",
        },
    });

    return userMessage;
}
