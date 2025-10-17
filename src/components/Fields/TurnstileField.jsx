import { Turnstile } from "@marsidev/react-turnstile";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";
import { useController, useFormContext } from "react-hook-form";

export default function TurnstileField({ slotProps: { siteKey } }) {
    const { control, clearErrors } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        name: "cf-turnstile-token",
        control,
        rules: {
            required: {
                value: true,
                message: "Debes completar el captcha para continuar",
            },
        },
    });

    const onSuccess = (token) => {
        field.onChange(token);
    };

    const onExpire = () => {
        field.onChange(null);
        clearErrors("cf-turnstile-response");
    };

    return (
        <Grid
            size={12}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                component={Turnstile}
                onSuccess={onSuccess}
                onExpire={onExpire}
                options={{
                    theme: "light",
                }}
                label={`Turnstile_${window.location.hostname}`}
                siteKey={siteKey}
                sx={{
                    mb: error ? 0 : "19.91px",
                }}
            />
            {error && <FormHelperText error>* {error.message}</FormHelperText>}
        </Grid>
    );
}

TurnstileField.propTypes = {
    slotProps: PropTypes.shape({
        siteKey: PropTypes.string.isRequired,
    }).isRequired,
};
