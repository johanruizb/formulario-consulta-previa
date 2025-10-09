import { URI } from "../components/constant";

/**
 * Servicio centralizado para manejar llamadas relacionadas con inscripciones
 */
export const enrollmentService = {
    /**
     * Verifica el estado general de las inscripciones
     * @returns {Promise<{activo: boolean}>}
     */
    checkStatus: async () => {
        const response = await fetch(URI.API + "/inscripcion/estado");
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Verifica si las inscripciones están activas
     * @param {object} estado - Estado de inscripciones
     * @returns {boolean}
     */
    isEnrollmentActive: (estado) => Boolean(estado?.activo),

    /**
     * Obtiene los cupos disponibles para un curso
     * @param {string} courseId - ID del curso
     * @returns {Promise<{curso_disponible: boolean, cupos: number}>}
     */
    getAvailableSlots: async (courseId) => {
        const response = await fetch(
            `${URI.API}/inscripcion/cupos/${courseId}`,
        );
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return response.json();
    },

    /**
     * Registra una nueva inscripción
     * @param {FormData} formData - Datos del formulario
     * @returns {Promise<Response>}
     */
    register: async (formData) => {
        return fetch(URI.API + "/inscripcion/registrar", {
            method: "POST",
            body: formData,
        });
    },

    /**
     * Registra en lista de espera
     * @param {object} data - Datos para lista de espera
     * @returns {Promise<Response>}
     */
    registerWaitlist: async (data) => {
        return fetch(URI.API + "/inscripcion/espera", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
};

export default enrollmentService;
