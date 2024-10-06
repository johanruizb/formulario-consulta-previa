import { useFormContext, useWatch } from "react-hook-form";
import AsyncSelect from "../Fields/AsyncSelect";
import { URI } from "../constant";

import PropTypes from "prop-types";

export default function CityBirth({ formRef }) {
    const { control } = useFormContext();
    const [countryBirth, stateBirth] = useWatch({
        control: control,
        name: ["countryBirth", "stateBirth"],
        // defaultValue: "CO",
    });

    return (
        <AsyncSelect
            fetchProps={{
                url:
                    countryBirth && stateBirth
                        ? `${URI.FORM}/v1/countries/${countryBirth}/states/${stateBirth}/cities`
                        : null,
            }}
            slotProps={{
                controller: {
                    name: "cityBirth",
                    defaultValue: "",
                    rules: {
                        required: {
                            value: true,
                            message: "Este campo no puede estar vacio",
                        },
                    },
                },
                field: {
                    label: "Ciudad de nacimiento",
                    required: true,
                },
                formRef,
            }}
        />
    );
}

CityBirth.propTypes = {
    formRef: PropTypes.any,
};
