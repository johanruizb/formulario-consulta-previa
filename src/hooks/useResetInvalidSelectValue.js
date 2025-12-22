import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

/**
 * Hook que valida si el valor actual de un campo select está dentro de las opciones disponibles.
 * Si el valor no es válido, lo resetea a null y lo mantiene así hasta que se seleccione una opción válida.
 *
 * @param {string} fieldName - Nombre del campo a validar
 * @param {Array} options - Array de opciones disponibles
 * @param {string} [valueKey="value"] - Clave que contiene el valor en cada opción (por defecto "value")
 *
 * @example
 * // Para BasicSelect con options como [{value: 1, label: "Option 1"}]
 * useResetInvalidSelectValue(field.name, fieldProps.options);
 *
 * @example
 * // Para AsyncSelect con options como [{id: 1, name: "Option 1"}, {iso2: "CO", name: "Colombia"}]
 * useResetInvalidSelectValue(field.name, options, "id");
 * // O para países
 * useResetInvalidSelectValue(field.name, options, "iso2");
 */
export default function useResetInvalidSelectValue(
    fieldName,
    options,
    valueKey = "value",
) {
    const { getValues, setValue } = useFormContext();

    useEffect(() => {
        // Solo ejecutar cuando las opciones estén disponibles y tengan elementos
        if (!options || !Array.isArray(options) || options.length === 0) {
            return;
        }

        const currentValue = getValues(fieldName);

        // Si el campo está vacío (null, undefined, ""), no hacer nada
        // Esto permite que el campo permanezca vacío intencionalmente
        if (
            currentValue === null ||
            currentValue === undefined ||
            currentValue === ""
        ) {
            return;
        }

        // Verificar si el valor actual existe en las opciones disponibles
        const isValid = options.some((option) => {
            // Soportar tanto {value: X} como {id: X} o {iso2: X}
            const optionValue =
                option[valueKey] ?? option.value ?? option.id ?? option.iso2;
            // Comparación flexible: convierte ambos a string para comparar
            return String(optionValue) === String(currentValue);
        });

        // Si el valor no es válido, resetearlo a null
        if (!isValid) {
            setValue(fieldName, null, {
                shouldValidate: false, // No validar inmediatamente para evitar errores durante carga
                shouldDirty: true, // Marcar como modificado
                shouldTouch: false, // No marcar como tocado
            });
        }
    }, [fieldName, options, valueKey, getValues, setValue]);
}
