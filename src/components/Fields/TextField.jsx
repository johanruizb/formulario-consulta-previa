import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useRenderCount } from "@uidotdev/usehooks";

import PropTypes from "prop-types";

import { Controller, useFormContext } from "react-hook-form";

import { isDevelopment } from "../../utils/isProduction";

export default function BasicTextField({ slotProps }) {
    const renderCount = useRenderCount();

    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, onChange: onChangeField, ...fieldProps },
    } = slotProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                const { onChange: onChangeController } = field;
                return (
                    <TextField
                        {...field}
                        onChange={(e) =>
                            onChangeField?.(e, onChangeController) ||
                            onChangeController(e)
                        }
                        variant="outlined"
                        error={Boolean(error?.type || error?.types)}
                        helperText={error?.message ?? " "}
                        fullWidth
                        InputProps={{
                            endAdornment: isDevelopment && (
                                <Typography variant="caption">
                                    {renderCount}
                                </Typography>
                            ),
                            ...InputProps,
                        }}
                        {...fieldProps}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}

BasicTextField.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
    }).isRequired,
};
