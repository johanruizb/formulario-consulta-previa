/**
 * HighlightedSelect
 *
 * Variante destacada de BasicSelect para campos de alta importancia.
 * Este componente aplica estilos visuales especiales para llamar la atención
 * del usuario hacia preguntas críticas del formulario.
 *
 * Características visuales:
 * - Background sutil con color primario
 * - Borde más grueso (2px) en color primario
 * - Label más grande (1.15rem) y en negrita (600)
 * - Espaciado extra para crear "aire visual"
 * - Hover mejorado
 *
 * Uso recomendado: Solo para 1-2 campos por formulario que sean
 * absolutamente críticos para la experiencia del usuario.
 *
 * @see BasicSelect - Para campos normales sin destacado
 */

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useRenderCount } from "@uidotdev/usehooks";

import PropTypes from "prop-types";

import { Controller, useFormContext } from "react-hook-form";

import { Box } from "@mui/material";
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

export default function HighlightedSelect({ slotProps }) {
    const renderCount = useRenderCount();

    const { control } = useFormContext();
    const {
        controller: controllerProps,
        field: fieldProps,
        formRef,
    } = slotProps;

    // Estilos de destacado siempre aplicados
    const highlightedStyles = {
        "& .MuiInputLabel-root": {
            fontWeight: 600,
        },
    };

    return (
        <Controller
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <Box
                        sx={{
                            p: 1.25,
                            mb: "19.91px",
                            borderRadius: "16px",
                            backgroundColor: "rgba(25, 118, 210, 0.25)",
                            // border: "2px dashed rgba(28, 100, 172, 1)",
                            // backgroundImage: `url(${getButtonsFooter(
                            //     "diplomado",
                            //     true
                            // )})`,
                            // backgroundSize: "cover", // 🔹 Ajusta la imagen para cubrir todo el fondo
                            // backgroundPosition: "center", // 🔹 Centra la imagen
                            // backgroundRepeat: "no-repeat", // 🔹 Evita que se repita
                        }}
                    >
                        <FormControl
                            fullWidth
                            error={Boolean(error?.type || error?.types)}
                            sx={highlightedStyles}
                            variant="standard"
                        >
                            <InputLabel>
                                {fieldProps.label}
                                {fieldProps.required ? " *" : ""}
                            </InputLabel>
                            <Select
                                {...field}
                                {...fieldProps}
                                ref={(el) => {
                                    if (formRef)
                                        formRef.current[field.name] = el;
                                    field.ref(el);
                                }}
                                IconComponent={(props) =>
                                    Counter({ renderCount, ...props })
                                }
                            >
                                {fieldProps.options.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {error?.message ?? " "}
                            </FormHelperText>
                        </FormControl>
                    </Box>
                );
            }}
            {...controllerProps}
        />
    );
}

HighlightedSelect.propTypes = {
    slotProps: PropTypes.shape({
        controller: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
        formRef: PropTypes.any,
    }).isRequired,
};
