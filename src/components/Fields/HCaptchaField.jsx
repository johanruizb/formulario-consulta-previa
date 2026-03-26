import HCaptcha from "@hcaptcha/react-hcaptcha";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import { useCallback, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

export default function HCaptchaField({ slotProps: { siteKey } }) {
    const { control, clearErrors } = useFormContext();
    const {
        field,
        fieldState: { error },
    } = useController({
        name: "h-captcha-response",
        control,
        rules: {
            required: {
                value: true,
                message: "Debes completar el captcha para continuar",
            },
        },
    });

    const ref = useRef(null);
    const [hasError, setHasError] = useState(false);

    const onVerify = useCallback(
        (token) => {
            field.onChange(token);
            setHasError(false);
        },
        [field],
    );

    const onExpire = useCallback(() => {
        field.onChange(null);
        clearErrors("h-captcha-response");
    }, [field, clearErrors]);

    const onError = useCallback(() => {
        field.onChange(null);
        setHasError(true);
    }, [field]);

    const handleRetry = useCallback(() => {
        setHasError(false);
        ref.current?.resetCaptcha();
    }, []);

    const isError = Boolean(error && !hasError);

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
                sx={{
                    // mb: isError ? 0 : "19.91px",
                    minWidth: 300,
                    minHeight: 65,
                }}
            >
                <HCaptcha
                    ref={ref}
                    sitekey={siteKey}
                    onVerify={onVerify}
                    onExpire={onExpire}
                    onError={onError}
                    theme="light"
                />
            </Box>
            {hasError && (
                <Box sx={{ textAlign: "center", mt: 1 }}>
                    <FormHelperText error>
                        * No se pudo cargar el captcha
                    </FormHelperText>
                    <Button
                        size="small"
                        startIcon={<RefreshRoundedIcon />}
                        onClick={handleRetry}
                    >
                        Reintentar
                    </Button>
                </Box>
            )}
            <FormHelperText error={isError}>
                * {isError ? error.message : "Marca el captcha para continuar"}
            </FormHelperText>
        </Grid>
    );
}

HCaptchaField.propTypes = {
    slotProps: PropTypes.shape({
        siteKey: PropTypes.string.isRequired,
    }).isRequired,
};
