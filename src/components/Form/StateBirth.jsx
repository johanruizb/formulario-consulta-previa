import { useFormContext, useWatch } from "react-hook-form";
import AsyncSelect from "../Fields/AsyncSelect";
import { URI } from "../constant";

import PropTypes from "prop-types";

export default function StateBirth({ formRef }) {
    const { control } = useFormContext();
    const countryBirth = useWatch({
        control: control,
        name: "countryBirth",
        // defaultValue: "",
    });

    return (
        <AsyncSelect
            fetchProps={{
                url: countryBirth
                    ? `${URI.FORM}/v1/countries/${countryBirth}/states`
                    : null,
            }}
            slotProps={{
                controller: {
                    name: "stateBirth",
                    defaultValue: "",
                    rules: {
                        required: {
                            value: true,
                            message: "Este campo no puede estar vacio",
                        },
                    },
                },
                field: {
                    label: "Departamento de nacimiento",
                    required: true,
                },
                formRef,
            }}
        />
    );
}

StateBirth.propTypes = {
    formRef: PropTypes.any,
};
