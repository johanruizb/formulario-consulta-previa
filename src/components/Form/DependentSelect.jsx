import { useFormContext, useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import AsyncSelect from "../Fields/AsyncSelect";

/**
 * Componente genérico para selects que dependen de otros campos
 * Reemplaza la duplicación en CityBirth, CityLocation, StateBirth, etc.
 *
 * @param {string|string[]} watchFields - Campo(s) a observar
 * @param {function} urlBuilder - Función que construye la URL basada en los valores observados
 * @param {string} name - Nombre del campo en el formulario
 * @param {string} label - Etiqueta del campo
 * @param {boolean} required - Si el campo es requerido
 * @param {object} validationRules - Reglas adicionales de validación
 * @param {object} formRef - Referencia para scroll en errores
 * @param {object} fieldProps - Props adicionales para el campo
 */
export default function DependentSelect({
    watchFields,
    urlBuilder,
    name,
    label,
    required = true,
    validationRules = {},
    formRef,
    fieldProps = {},
}) {
    const { control } = useFormContext();

    // Observa los campos de los que depende
    const watchedValues = useWatch({
        control,
        name: Array.isArray(watchFields) ? watchFields : [watchFields],
    });

    // Construye la URL basada en los valores observados
    const url = urlBuilder(
        Array.isArray(watchFields) ? watchedValues : watchedValues[0],
    );

    return (
        <AsyncSelect
            fetchProps={{ url }}
            slotProps={{
                controller: {
                    name,
                    defaultValue: "",
                    rules: {
                        required: required
                            ? {
                                  value: true,
                                  message: "Este campo no puede estar vacío",
                              }
                            : false,
                        ...validationRules,
                    },
                },
                field: {
                    label,
                    required,
                    ...fieldProps,
                },
                formRef,
            }}
        />
    );
}

DependentSelect.propTypes = {
    watchFields: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    urlBuilder: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    required: PropTypes.bool,
    validationRules: PropTypes.object,
    formRef: PropTypes.any,
    fieldProps: PropTypes.object,
};
