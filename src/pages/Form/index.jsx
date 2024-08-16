import { useTheme } from "@emotion/react";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useRenderCount } from "@uidotdev/usehooks";
import { Fragment } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NumericFormatCustom from "../../components/Fields/FormatNumber";
import BasicSelect from "../../components/Fields/Select";
import BasicTextField from "../../components/Fields/TextField";

export default function FullScreenDialog() {
    const renderCount = useRenderCount();
    const methods = useForm({ mode: "onBlur" });
    const theme = useTheme();

    return (
        <Fragment>
            <Box
                sx={{
                    position: "fixed",
                    bottom: 1,
                    left: 1,
                    p: 1,
                    zIndex: theme.zIndex.modal + 1,
                }}
            >
                <Typography variant="caption">Render count: {renderCount}</Typography>
            </Box>
            <Dialog fullScreen open>
                <DialogTitle>Registro</DialogTitle>
                <DialogContent
                    sx={{
                        pt: "8px !important",
                    }}
                >
                    <FormProvider {...methods}>
                        <form>
                            <Grid container spacing={1.25}>
                                <Grid item xs={12} md={6}>
                                    <BasicTextField
                                        slotProps={{
                                            controller: {
                                                name: "firstName",
                                                defaultValue: "",
                                                rules: {
                                                    required: {
                                                        value: true,
                                                        message: "Este campo no puede estar vacio",
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                        message: "Por favor verifica el nombre",
                                                    },
                                                },
                                            },
                                            field: {
                                                label: "Nombres",
                                                required: true,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicTextField
                                        slotProps={{
                                            controller: {
                                                name: "lastName",
                                                defaultValue: "",
                                                rules: {
                                                    required: {
                                                        value: true,
                                                        message: "Este campo no puede estar vacio",
                                                    },
                                                    pattern: {
                                                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                        message: "Por favor verifica el apellido",
                                                    },
                                                },
                                            },
                                            field: {
                                                label: "Apellidos",
                                                required: true,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicSelect
                                        slotProps={{
                                            controller: {
                                                name: "identityDocument",
                                                defaultValue: "",
                                                rules: {
                                                    required: {
                                                        value: true,
                                                        message: "Este campo no puede estar vacio",
                                                    },
                                                },
                                            },
                                            field: {
                                                label: "Tipo de documento de identidad",
                                                required: true,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <BasicTextField
                                        slotProps={{
                                            controller: {
                                                name: "documentNumber",
                                                defaultValue: "",
                                                rules: {
                                                    required: {
                                                        value: true,
                                                        message: "Este campo no puede estar vacio",
                                                    },
                                                },
                                            },
                                            field: {
                                                label: "Número de documento",
                                                required: true,
                                                InputProps: {
                                                    inputComponent: NumericFormatCustom,
                                                }
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </FormProvider>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() =>
                            methods.trigger().then((isValid) => {
                                if (isValid) {
                                    console.log("Valido");
                                } else {
                                    console.log("Invalido");
                                }
                            })
                        }
                    >
                        Validar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
