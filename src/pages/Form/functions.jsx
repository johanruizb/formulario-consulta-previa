import { FORM_FIELDS_LABELS } from "../../components/constant";

// Re-exportar funciones de assets desde config
export {
    getBanner,
    getButtonsFooter,
    getFooter,
} from "../../config/courseAssets";

export function getFormErrorFields(errors, fields = []) {
    const keys = Object.keys(errors);

    const fieldLabels = {};
    for (const field of fields) {
        const name = field.controller?.name;
        const label = field.field?.label;
        if (name && label) fieldLabels[name] = label;
    }

    const labels = keys
        .map((key) => fieldLabels[key] ?? FORM_FIELDS_LABELS[key] ?? key)
        .filter(Boolean)
        .join(", ");

    return {
        message: "Por favor verifica los campos: \n" + labels,
        error: true,
        title: "El formulario contiene errores",
    };
}

const sortedFields = [
    "firstName",
    "lastName",
    "identityDocument",
    "documentNumber",
    "countryExpedition",
    "frontDocument",
    "backDocument",
    "birthdate",
    "countryBirth",
    "stateBirth",
    "cityBirth",
    "gender",
    "ethnicity",
    "entityName",
    "typeEntity",
    "phoneNumber",
    "whatsappNumber",
    "email",
    "stateLocation",
    "address",
    "neighborhood",
    "zona",
    "connectivity",
    "continuar_curso_120",
    "processingOfPersonalData",
];

export function scrollIntoError(keys, formRef) {
    for (const field of sortedFields)
        if (keys.includes(field)) {
            formRef.current[field]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            break;
        }
}

const replaceAllSpaces = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.replaceAll(" ", "") ?? "";
    onBlur?.(e);
    onChange?.(e);
};

const trimSpaces = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.trim() ?? "";
    onBlur?.(e);
    onChange?.(e);
};

const toUpperCase = (e, { onBlur, onChange }) => {
    e.target.value = e.target.value?.toUpperCase() ?? "";
    onBlur?.(e);
    onChange?.(e);
};

export { replaceAllSpaces, toUpperCase, trimSpaces };
