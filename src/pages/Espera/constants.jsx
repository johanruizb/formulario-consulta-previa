import PhoneNumber from "../../components/Fields/PhoneNumber";
import BasicTextField from "../../components/Fields/TextField";
import { replaceAllSpaces, toUpperCase } from "../Form/functions";

const WaitListFields = [
    {
        Component: BasicTextField,
        controller: {
            name: "firstName",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
                pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                    message: "Por favor verifica el nombre",
                },
                maxLength: {
                    value: 150,
                    message: "El nombre no puede tener más de 150 caracteres",
                },
            },
        },
        field: {
            label: "Nombres",
            required: true,
            onChange: toUpperCase,
        },
    },
    {
        Component: BasicTextField,
        controller: {
            name: "lastName",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
                pattern: {
                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                    message: "Por favor verifica el apellido",
                },
                maxLength: {
                    value: 150,
                    message: "El apellido no puede tener más de 150 caracteres",
                },
            },
        },
        field: {
            label: "Apellidos",
            required: true,
            onChange: toUpperCase,
        },
    },
    {
        Component: PhoneNumber,
        controller: {
            name: "phoneNumber",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
            },
        },
        field: {
            label: "Número de teléfono - WhatsApp",
            required: true,
        },
    },
    {
        Component: BasicTextField,
        controller: {
            name: "email",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
                pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                    message: "Por favor verifica el correo",
                },
                maxLength: {
                    value: 300,
                    message: "El correo no puede tener más de 300 caracteres",
                },
            },
        },
        field: {
            label: "Correo electrónico",
            required: true,
            onBlur: replaceAllSpaces,
        },
    },
];

export default WaitListFields;
