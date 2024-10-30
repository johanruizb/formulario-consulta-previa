import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useRenderCount } from "@uidotdev/usehooks";

import dayjs from "dayjs";

import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { isDevelopment } from "../../utils/isProduction";
import getTimeout from "../../utils/timeout";
import SelectPlaceHolder from "./SelectPlaceHolder";

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

export default function AsyncSelect({ slotProps, fetchProps = {} }) {
    const renderCount = useRenderCount();

    const { control } = useFormContext();
    const {
        controller: controllerProps,
        field: fieldProps,
        formRef,
    } = slotProps;

    const [options, setOptions] = useState();

    const fetchURL = fetchProps?.url ?? slotProps?.fetch?.url;
    const fetchOptions = fetchProps?.options ?? slotProps?.fetch?.options;

    useEffect(() => {
        if (fetchURL) {
            const start = dayjs();
            fetch(fetchURL, fetchOptions).then((response) => {
                const timeout = getTimeout(start);
                setTimeout(() => {
                    response.json().then(setOptions);
                }, timeout);
            });
        }
    }, [fetchURL, fetchOptions]);

    if (fetchURL === null)
        return (
            <SelectPlaceHolder
                slotProps={slotProps}
                renderCount={renderCount}
            />
        );

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return options ? (
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
                            ref={(el) => {
                                if (formRef) formRef.current[field.name] = el;
                                field.ref(el);
                            }}
                        >
                            {options?.map((option) => (
                                <MenuItem
                                    key={option.id}
                                    value={option.iso2 ?? option.id}
                                >
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
                ) : (
                    <Skeleton
                        sx={{
                            height: 59,
                            borderRadius: 1,
                            width: "100%",
                            mb: "19.91px",
                        }}
                    />
                );
            }}
            {...controllerProps}
        />
    );
}

AsyncSelect.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
        formRef: PropTypes.any,
        fetch: PropTypes.shape({
            url: PropTypes.string,
            options: PropTypes.object,
        }),
    }).isRequired,
    fetchProps: PropTypes.shape({
        url: PropTypes.string,
        options: PropTypes.object,
    }),
};
