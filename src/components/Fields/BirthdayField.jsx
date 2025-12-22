import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PropTypes from "prop-types";

import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";

import dayjs from "dayjs";
import "dayjs/locale/es";

function YearCount({ date }) {
    const parsed = useMemo(() => {
        if (dayjs.isDayjs(date)) return date;
        else if (typeof date === "string") {
            const formattedDate = dayjs(date);
            return formattedDate.isValid() ? formattedDate : null;
        }

        return null;
    }, [date]);

    return (
        parsed && (
            <Typography variant="body2" flex="none">
                {`${dayjs(dayjs()).diff(parsed, "years")} años`}
            </Typography>
        )
    );
}

YearCount.propTypes = {
    date: PropTypes.any,
};

export default function BirthdayField({ slotProps }) {
    // const renderCount = useRenderCount();

    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: { InputProps, ...fieldProps },
        formRef,
    } = slotProps;

    const { required } = controllerProps.rules?.required?.value || {};

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <DatePicker
                        {...field}
                        ref={(el) => {
                            if (formRef) formRef.current[field.name] = el;
                            field.ref(el);
                        }}
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
                                required: Boolean(required),
                                error: Boolean(error?.type || error?.types),
                                helperText: error?.message ?? " ",
                                InputProps: {
                                    endAdornment: (
                                        <YearCount date={field.value} />
                                    ),
                                    ...InputProps,
                                },
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

BirthdayField.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
        formRef: PropTypes.any,
    }).isRequired,
};
