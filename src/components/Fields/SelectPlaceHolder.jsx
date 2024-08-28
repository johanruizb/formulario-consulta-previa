import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { isDevelopment } from "../../utils/isProduction";

const Counter = ({ renderCount, className }) => {
    return (
        <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            sx={{
                pr: "14px",
            }}
        >
            <ArrowDropDownIcon
                className={className}
                sx={{
                    position: "unset !important",
                }}
            />
            {isDevelopment && (
                <Typography variant="caption">{renderCount}</Typography>
            )}
        </Stack>
    );
};

Counter.propTypes = {
    renderCount: PropTypes.number.isRequired,
    className: PropTypes.string,
};

export default function SelectPlaceHolder({ slotProps, renderCount }) {
    const { control } = useFormContext();
    const { controller: controllerProps, field: fieldProps } = slotProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <FormControl
                        fullWidth
                        error={Boolean(error?.type || error?.types)}
                    >
                        <InputLabel variant="outlined">
                            {fieldProps.label}
                            {fieldProps.required ? " *" : ""}
                        </InputLabel>
                        <Select
                            {...field}
                            {...fieldProps}
                            IconComponent={(props) =>
                                Counter({ renderCount, ...props })
                            }
                        ></Select>
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}

SelectPlaceHolder.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
    }).isRequired,

    renderCount: PropTypes.number.isRequired,
};
