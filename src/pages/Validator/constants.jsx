import BasicTextField from "../../components/Fields/TextField";
import TurnstileField from "../../components/Fields/TurnstileField";
import isProduction from "../../utils/isProduction";
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
        Component: TurnstileField,
        siteKey: isProduction
            ? "0x4AAAAAAB2McbF4i64uJyTJ"
            : "1x00000000000000000000AA",
        gridless: true,
    },
];

export default ValidatorFields;
