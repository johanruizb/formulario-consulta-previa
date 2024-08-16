import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRenderCount } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

export default function BasicTextField({ slotProps }) {
    const renderCount = useRenderCount();

    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, ...fieldProps },
    } = slotProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <TextField
                        {...field}
                        variant="outlined"
                        error={Boolean(error?.type || error?.types)}
                        helperText={error?.message ?? " "}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <Typography variant="caption">{renderCount}</Typography>
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
