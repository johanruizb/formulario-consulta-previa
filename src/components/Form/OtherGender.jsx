import Grid from "@mui/material/Grid2";
import BasicTextField from "../Fields/TextField";
import { useFormContext, useWatch } from "react-hook-form";

import PropTypes from "prop-types";

function OtherGender({ formRef }) {
    const { control } = useFormContext();

    const gender = useWatch({
        control,
        name: "gender",
        defaultValue: "",
    });

    return (
        gender === 0 && (
            <Grid
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <BasicTextField
                    slotProps={{
                        controller: {
                            name: "otherGender",
                            defaultValue: "",
                            rules: {
                                required: {
                                    value: true,
                                    message: "Este campo no puede estar vacio",
                                },
                            },
                        },
                        field: {
                            label: "Otro (especificar)",
                            required: true,
                            onChange: (e, onChangeController) =>
                                onChangeController(
                                    (e.target.value || "").toUpperCase(),
                                ),
                        },
                        formRef,
                    }}
                />
            </Grid>
        )
    );
}

OtherGender.propTypes = {
    formRef: PropTypes.any,
};

export default OtherGender;
