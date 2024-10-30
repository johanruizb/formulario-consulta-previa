import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";

import { Controller, useFormContext } from "react-hook-form";

export default function CheckboxField({ slotProps }) {
    const { control } = useFormContext();

    const { controller: controllerProps, formRef } = slotProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <FormControl
                        component="fieldset"
                        variant="outlined"
                        error={Boolean(error?.type || error?.types)}
                    >
                        <FormLabel component="legend">
                            Politica de privacidad *
                        </FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={field.value}
                                        ref={(el) => {
                                            if (formRef)
                                                formRef.current[field.name] =
                                                    el;
                                            field.ref(el);
                                        }}
                                    />
                                }
                                label={
                                    <Typography>
                                        Acepto la{" "}
                                        <Link
                                            href="https://www.univalle.edu.co/politica-de-tratamiento-de-la-informacion-personal"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            politica de tratamiento datos
                                            personales
                                            <OpenInNewIcon
                                                sx={{
                                                    fontSize: "14px",
                                                }}
                                            />
                                        </Link>
                                        *
                                    </Typography>
                                }
                            />
                        </FormGroup>
                        <FormHelperText
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            {error?.message ?? " "}
                        </FormHelperText>
                    </FormControl>
                </Box>
            )}
            {...controllerProps}
        />
    );
}

CheckboxField.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object,
        formRef: PropTypes.any,
    }).isRequired,
};
