import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRenderCount } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import ReactCountryFlag from "react-country-flag";
import { Controller, useFormContext } from "react-hook-form";
import { isDevelopment } from "../../utils/isProduction";
import PhoneMask from "./FormatPhone";

export default function PhoneNumber({ slotProps }) {
    const renderCount = useRenderCount();
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { ...fieldProps },
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
                            startAdornment: (
                                <ReactCountryFlag countryCode="CO" svg />
                            ),
                            endAdornment: isDevelopment && (
                                <Typography variant="caption">
                                    {renderCount}
                                </Typography>
                            ),
                            inputComponent: PhoneMask,
                        }}
                        {...fieldProps}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}

PhoneNumber.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
    }).isRequired,
};
