import { Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useRenderCount } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

const Counter = ({ renderCount }) => {
    return (
        <Typography
            variant="caption"
            sx={{
                pr: "14px",
            }}
        >
            {renderCount}
        </Typography>
    );
};

Counter.propTypes = {
    renderCount: PropTypes.number.isRequired,
};

export default function BasicSelect({ slotProps }) {
    const renderCount = useRenderCount();

    const { control } = useFormContext();
    const { controller: controllerProps, field: fieldProps } = slotProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <FormControl fullWidth error={Boolean(error?.type || error?.types)}>
                        <InputLabel variant="outlined">{fieldProps.label}{fieldProps.required ? " *" : ""}</InputLabel>
                        <Select
                            {...field}
                            {...fieldProps}
                            IconComponent={() => Counter({ renderCount })}
                        >
                            <MenuItem value={1}>(CC) Cédula de Ciudadanía</MenuItem>
                            <MenuItem value={2}>(TI) Tarjeta de Identidad</MenuItem>
                        </Select>
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                );
            }}
            {...controllerProps}
        />
    );
}

BasicSelect.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
    }).isRequired,
};
