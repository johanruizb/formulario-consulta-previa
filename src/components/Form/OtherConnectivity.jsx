import Grid from "@mui/material/Grid2";
import BasicTextField from "../Fields/TextField";
import { useFormContext, useWatch } from "react-hook-form";

import PropTypes from "prop-types";
import { toUpperCase } from "../../pages/Form/functions";

function OtherConnectivity({ formRef }) {
    const { control } = useFormContext();

    const gender = useWatch({
        control,
        name: "connectivity",
    });

    return (
        gender === "otra" && (
            <Grid
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <BasicTextField
                    slotProps={{
                        controller: {
                            name: "otra_conectividad",
                            defaultValue: "",
                            rules: {
                                required: {
                                    value: true,
                                    message: "Este campo no puede estar vacio",
                                },
                                maxLength: {
                                    value: 100,
                                    message:
                                        "Este campo no puede tener más de 100 caracteres",
                                },
                            },
                        },
                        field: {
                            label: "Otra conectividad (especificar)",
                            required: true,
                            onChange: toUpperCase,
                        },
                        formRef,
                    }}
                />
            </Grid>
        )
    );
}

OtherConnectivity.propTypes = {
    formRef: PropTypes.any,
};

export default OtherConnectivity;
