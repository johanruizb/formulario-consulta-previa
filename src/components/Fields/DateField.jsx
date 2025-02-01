import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useRenderCount } from "@uidotdev/usehooks";

import PropTypes from "prop-types";

import { Controller, useFormContext } from "react-hook-form";

import dayjs from "dayjs";
import "dayjs/locale/es";

import { isDevelopment } from "../../utils/isProduction";

export default function DateField({ slotProps }) {
    const renderCount = useRenderCount();

    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, ...fieldProps },
    } = slotProps;

    const devProps = isDevelopment
        ? {
              endAdornment: (
                  <Typography variant="caption">{renderCount}</Typography>
              ),
          }
        : {};

    const fieldPropsWithDev = {
        InputProps: {
            ...devProps,
            ...InputProps,
        },
    };

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <DatePicker
                        {...field}
                        onChange={(date) => {
                            const formattedDate = dayjs(date);
                            if (formattedDate.isValid()) {
                                field.onChange(formattedDate);
                            } else {
                                field.onChange("");
                            }
                        }}
                        value={
                            dayjs.isDayjs(field.value)
                                ? field.value
                                : typeof field.value === "string"
                                  ? dayjs(field.value)
                                  : null
                        }
                        // format="DD/M/YYYY"
                        autoComplete="one-time-code"
                        slotProps={{
                            textField: {
                                name: field.name,
                                id: field.name,
                                fullWidth: true,
                                error: Boolean(error?.type || error?.types),
                                helperText: error?.message ?? " ",
                                ...fieldPropsWithDev,
                            },
                            field: {
                                autoComplete: "one-time-code",
                            },
                        }}
                        {...fieldProps}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}

DateField.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
    }).isRequired,
};
