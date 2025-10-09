/**
 * Reglas de validación centralizadas
 * Separadas de la definición de campos para mejor mantenibilidad
 */

export const VALIDATION_PATTERNS = {
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    documentNumber: /^[^.,\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-()]+$/,
};

export const VALIDATION_MESSAGES = {
    required: "Este campo no puede estar vacío",
    invalidName: "Por favor verifica el nombre",
    invalidDocument:
        "El número de documento no puede tener espacios, puntos o comas",
    invalidEmail: "Por favor ingresa un correo electrónico válido",
    invalidPhone: "Por favor ingresa un número de teléfono válido",
};

/**
 * Reglas de validación reutilizables
 */
export const VALIDATION_RULES = {
    required: {
        value: true,
        message: VALIDATION_MESSAGES.required,
    },

    firstName: {
        required: {
            value: true,
            message: VALIDATION_MESSAGES.required,
        },
        pattern: {
            value: VALIDATION_PATTERNS.name,
            message: VALIDATION_MESSAGES.invalidName,
        },
        maxLength: {
            value: 150,
            message: "El nombre no puede tener más de 150 caracteres",
        },
    },

    lastName: {
        required: {
            value: true,
            message: VALIDATION_MESSAGES.required,
        },
        pattern: {
            value: VALIDATION_PATTERNS.name,
            message: "Por favor verifica el apellido",
        },
        maxLength: {
            value: 150,
            message: "El apellido no puede tener más de 150 caracteres",
        },
    },

    documentNumber: {
        required: {
            value: true,
            message: VALIDATION_MESSAGES.required,
        },
        maxLength: {
            value: 20,
            message:
                "El número de documento no puede tener más de 20 caracteres",
        },
        pattern: {
            value: VALIDATION_PATTERNS.documentNumber,
            message: VALIDATION_MESSAGES.invalidDocument,
        },
    },

    email: {
        required: {
            value: true,
            message: VALIDATION_MESSAGES.required,
        },
        pattern: {
            value: VALIDATION_PATTERNS.email,
            message: VALIDATION_MESSAGES.invalidEmail,
        },
    },

    phoneNumber: {
        required: {
            value: true,
            message: VALIDATION_MESSAGES.required,
        },
        pattern: {
            value: VALIDATION_PATTERNS.phone,
            message: VALIDATION_MESSAGES.invalidPhone,
        },
        minLength: {
            value: 10,
            message: "El número debe tener al menos 10 dígitos",
        },
    },

    address: {
        required: {
            value: true,
            message: VALIDATION_MESSAGES.required,
        },
        maxLength: {
            value: 200,
            message: "La dirección no puede tener más de 200 caracteres",
        },
    },
};

/**
 * Helper para crear regla de campo requerido
 */
export const createRequiredRule = (message = VALIDATION_MESSAGES.required) => ({
    required: {
        value: true,
        message,
    },
});

/**
 * Helper para crear regla de maxLength
 */
export const createMaxLengthRule = (length, fieldName = "campo") => ({
    maxLength: {
        value: length,
        message: `El ${fieldName} no puede tener más de ${length} caracteres`,
    },
});

/**
 * Helper para crear regla de minLength
 */
export const createMinLengthRule = (length, fieldName = "campo") => ({
    minLength: {
        value: length,
        message: `El ${fieldName} debe tener al menos ${length} caracteres`,
    },
});

export default VALIDATION_RULES;
