import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import { useRenderCount } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import useSWRImmutable from "swr/immutable";
import { format } from "../utils";
import Counter from "./Counter";

function getCustomURL(url, values) {
    return format(url, values);
}

export default function CustomAsyncSelect({ slotProps }) {
    const { control } = useFormContext();

    const {
        fetch: { url },
        ...otherProps
    } = slotProps;

    const {
        controller: { dependencies, ...controllerProps },
        field: fieldProps,
    } = slotProps;

    const values = useWatch({
        control,
        name: dependencies,
    });

    const customURL = getCustomURL(url, values);
    const { data, error, isLoading } = useSWRImmutable(customURL);

    return isLoading || error ? (
        <FormControl
            fullWidth
            error={Boolean(error)}
            required={controllerProps.rules?.required?.value}
        >
            <InputLabel variant="outlined">{fieldProps.label}</InputLabel>
            <Skeleton
                sx={{
                    height: 56,
                    width: "100%",
                }}
            />
            <FormHelperText>
                {error ? "No se han podido recuperar las opciones" : " "}
            </FormHelperText>
        </FormControl>
    ) : (
        <AsyncSelect
            slotProps={{
                controller: { ...controllerProps },
                field: { ...otherProps.field, options: data },
            }}
        />
    );
}

CustomAsyncSelect.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
        formRef: PropTypes.any,
        fetch: PropTypes.shape({
            url: PropTypes.string,
            options: PropTypes.object,
        }),
    }).isRequired,
};

function AsyncSelect({ slotProps }) {
    const renderCount = useRenderCount();
    const { control } = useFormContext();

    const {
        controller: controllerProps,
        field: fieldProps,
        formRef,
    } = slotProps;

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <FormControl
                        fullWidth
                        error={Boolean(error?.type || error?.types)}
                        required={controllerProps.rules?.required?.value}
                    >
                        <InputLabel variant="outlined">
                            {fieldProps.label}
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
                            {fieldProps?.options?.length > 0 &&
                                fieldProps?.options?.map((option, index) => {
                                    const uniqueKey = `${field.name}-${
                                        option.iso2 ?? option.id
                                    }-${index}`;
                                    return (
                                        <MenuItem
                                            key={uniqueKey}
                                            value={option.iso2 ?? option.id}
                                        >
                                            {option.name}
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                        <FormHelperText>{error?.message ?? " "}</FormHelperText>
                    </FormControl>
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
};
