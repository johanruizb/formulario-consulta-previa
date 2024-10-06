import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Controller, useFormContext } from "react-hook-form";

import PropTypes from "prop-types";

function LargeQuestion({ slotProps }) {
    const { control } = useFormContext();
    const { controller: controllerProps, formRef } = slotProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl
                    required
                    fullWidth
                    error={Boolean(error?.type || error?.types)}
                >
                    <FormLabel
                        id="demo-form-control-label-placement"
                        sx={{
                            color: "black",
                        }}
                    >
                        Le interesa seguir fortaleciendo sus conocimiento y
                        competencias sobre Consulta Previa a través de un
                        diplomado virtual gratuito de 120 horas certificado por
                        la Universidad del Valle.
                    </FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-form-control-label-placement"
                        name="position"
                        defaultValue="top"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={(el) => {
                            if (formRef) formRef.current[field.name] = el;
                            field.ref(el);
                        }}
                    >
                        <FormControlLabel
                            value="si"
                            control={<Radio />}
                            label="Si"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                    <FormHelperText
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        {error?.message ?? " "}
                    </FormHelperText>
                </FormControl>
            )}
            {...controllerProps}
        />
    );
}

LargeQuestion.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        formRef: PropTypes.any,
    }).isRequired,
};

export default LargeQuestion;
