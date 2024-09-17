import Grid from "@mui/material/Grid";
import BasicTextField from "../Fields/TextField";
import { useFormContext, useWatch } from "react-hook-form";

function OtherConnectivity() {
    const { control } = useFormContext();

    const gender = useWatch({
        control,
        name: "connectivity",
    });

    return (
        gender === "otra" && (
            <Grid item xs={12} md={6}>
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
                            },
                        },
                        field: {
                            label: "Otra conectividad (especificar)",
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

export default OtherConnectivity;
