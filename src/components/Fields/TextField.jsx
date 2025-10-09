import { useCallback, useMemo } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRenderCount } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { isDevelopment } from "../../utils/isProduction";

function BasicTextField({ slotProps }) {
    const renderCount = useRenderCount();
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: {
            InputProps,
            onChange: onChangeField,
            onBlur: onBlurField,
            ...fieldProps
        },
        formRef,
    } = slotProps;

    // Memoizar el componente de renderCount para desarrollo
    const renderCountComponent = useMemo(
        () =>
            isDevelopment && (
                <Typography variant="caption">{renderCount}</Typography>
            ),
        [renderCount],
    );

    // Función de renderizado optimizada para el Controller
    const renderField = useCallback(
        ({ field, fieldState: { error } }) => {
            const { onChange: onChangeController, onBlur: onBlurController } =
                field;

            // Handler optimizado para onChange
            const handleChange = (e) => {
                if (onChangeField) {
                    return onChangeField(e, { onChange: onChangeController });
                }
                return onChangeController(e);
            };

            // Handler optimizado para onBlur
            const handleBlur = (e) => {
                if (onBlurField) {
                    return onBlurField(e, {
                        onBlur: onBlurController,
                        onChange: onChangeController,
                    });
                }
                return onBlurController(e);
            };

            // Handler optimizado para ref
            const handleRef = (el) => {
                if (formRef) formRef.current[field.name] = el;
                field.ref(el);
            };

            // Memoizar slotProps para evitar recreación
            const memoizedSlotProps = {
                input: {
                    endAdornment: renderCountComponent,
                    ...InputProps,
                },
            };

            return (
                <TextField
                    {...field}
                    ref={handleRef}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    variant="outlined"
                    error={Boolean(error?.type || error?.types)}
                    helperText={error?.message ?? " "}
                    fullWidth
                    {...fieldProps}
                    slotProps={memoizedSlotProps}
                />
            );
        },
        [
            onChangeField,
            onBlurField,
            formRef,
            fieldProps,
            InputProps,
            renderCountComponent,
        ],
    );

    return (
        <Controller
            control={control}
            render={renderField}
            {...controllerProps}
        />
    );
}

// Exportar sin memoización - el Controller de react-hook-form ya optimiza los renders
export default BasicTextField;

BasicTextField.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
        formRef: PropTypes.any,
    }).isRequired,
};
