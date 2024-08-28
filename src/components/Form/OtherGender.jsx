import Grid from "@mui/material/Grid";
import BasicTextField from "../Fields/TextField";
import { useFormContext, useWatch } from "react-hook-form";

function OtherGender() {
    const { control } = useFormContext();

    const gender = useWatch({
        control,
        name: "gender",
        defaultValue: "",
    });

    return (
        gender === 0 && (
            <Grid item xs={12} md={6}>
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
                    }}
                />
            </Grid>
        )
    );
}

export default OtherGender;
