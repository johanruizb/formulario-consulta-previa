import BasicTextField from "../../components/Fields/TextField";
import HCaptchaField from "../../components/Fields/HCaptchaField";
import { replaceAllSpaces } from "../Form/functions";

const ValidatorFields = [
    {
        Component: BasicTextField,
        controller: {
            name: "documentNumber",
            defaultValue: "",
            rules: {
                required: {
                    value: true,
                    message: "Este campo no puede estar vacio",
                },
                maxLength: {
                    value: 20,
                    message:
                        "El número de documento no puede tener más de 20 caracteres",
                },
                pattern: {
                    value: /^[^.,\s]+$/,
                    message:
                        "El número de documento no puede tener espacios, puntos o comas",
                },
            },
        },
        field: {
            label: "Número de documento",
            required: true,
            onBlur: replaceAllSpaces,
        },
    },
    {
        Component: HCaptchaField,
        siteKey: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
        gridless: true,
    },
];

export default ValidatorFields;
