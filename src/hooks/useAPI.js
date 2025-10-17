import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import fetcher from "../hooks/request/config";
import { URI } from "../components/constant";

/**
 * Configuración de opciones por defecto para SWR
 */
const DEFAULT_SWR_OPTIONS = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
};

/**
 * Hook centralizado para llamadas a la API
 * Proporciona una interfaz consistente para data fetching
 *
 * @param {string|null} endpoint - Endpoint de la API (sin el prefijo URI.API)
 * @param {object} options - Opciones de configuración
 * @param {boolean} options.immutable - Si true, usa useSWRImmutable
 * @param {function} options.fetcher - Fetcher personalizado
 * @param {object} options.swrConfig - Configuración adicional de SWR
 * @returns {object} - Resultado de useSWR con data, error, isLoading, etc.
 */
export function useAPI(endpoint, options = {}) {
    const {
        immutable = false,
        fetcher: customFetcher = fetcher,
        swrConfig = {},
    } = options;

    // Selecciona el hook apropiado
    const hook = immutable ? useSWRImmutable : useSWR;

    // Construye la URL completa si hay endpoint
    const url = endpoint ? URI.API + endpoint : null;

    return hook(url, customFetcher, {
        ...DEFAULT_SWR_OPTIONS,
        ...swrConfig,
    });
}

/**
 * Hook específico para obtener el estado de inscripciones
 */
export function useEnrollmentStatus() {
    const { data, error, isLoading, mutate } = useAPI("/inscripcion/estado");

    return {
        status: data,
        isActive: Boolean(data?.activo),
        error,
        isLoading,
        refresh: mutate,
    };
}

/**
 * Hook específico para obtener cupos de un curso
 * @param {string} courseId - ID del curso
 */
export function useCourseSlots(courseId) {
    const { data, error, isLoading, isValidating, mutate } = useAPI(
        courseId ? `/inscripcion/cupos/${courseId}` : null,
    );

    return {
        data,
        isAvailable: Boolean(data?.curso_disponible),
        hasSlots: Number(data?.cupos) > 0,
        slotsCount: data?.cupos || 0,
        error,
        isLoading,
        isValidating,
        refresh: mutate,
    };
}

export default useAPI;
