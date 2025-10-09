import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Fragment, useCallback, useRef, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import { FORM_FIELDS_LABELS } from "../../components/constant";
import {
    getBanner,
    getButtonsFooter,
    getFooter,
} from "../../config/courseAssets";
import { useAlert } from "../../hooks/alert/useAlertNew";
import useSmall from "../../hooks/breakpoint/useSmall";
import INSCRIPCION from "../../hooks/request/inscripcion";
import SEARCH from "../../hooks/request/search";
import { formDataFromObject } from "../../utils/form";
import isProduction from "../../utils/isProduction";
import useFieldForm from "../Form/constant";
import { scrollIntoError } from "../Form/functions";
import ValidatorFields from "./constants";

const DEFAULT_MESSAGE = "Por favor, ingresa el número de tu cédula";

function Validator({ state }) {
    const [registered, setRegistered] = state;
    const formRef = useRef({});

    const small = useSmall();

    const Banner = getBanner("diplomado", small);
    const Footer = getFooter("diplomado", small);

    const methods = useFormContext();
    const { handleSubmit, reset } = methods;

    const [message, setMessage] = useState(DEFAULT_MESSAGE);
    const [loading, setLoading] = useState(false);

    const { showAlert } = useAlert();

    const onSearch = useCallback(
        async (data) => {
            try {
                setLoading(true);
                const response = await SEARCH.verify(data);
                const responseData = await response.json();

                switch (response.status) {
                    case 200:
                        // Usuario encontrado - llenar formulario con datos
                        setMessage(null);
                        setRegistered(true);
                        reset(responseData.persona);
                        break;

                    case 404:
                        // Usuario no encontrado - limpiar y permitir registro
                        setRegistered(false);
                        reset({
                            documentNumber: data.documentNumber,
                        });
                        break;

                    default:
                        // Ya inscrito u otros casos
                        showAlert({
                            title: "Ya te has inscrito!",
                            message: responseData.message,
                            error: true,
                            refreshOnAccept: true,
                        });
                        break;
                }
            } catch (error) {
                console.error("Error en búsqueda:", error);
                showAlert({
                    title: "Error de conexión",
                    message:
                        "No se pudo verificar el documento. Intenta nuevamente.",
                    error: true,
                });
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setRegistered, reset, showAlert],
    );

    const onCancel = useCallback(() => {
        setTimeout(() => location.reload(), 750);
    }, []);

    const onSubmit = useCallback(
        async (data) => {
            try {
                setLoading(true);

                const formData = formDataFromObject({
                    ...data,
                    processingOfPersonalData: true,
                    alreadyRegistered: true,
                });

                const response = await INSCRIPCION.registrar(formData);
                const result = await response.json();

                if (response.ok) {
                    showAlert({
                        message: result.message,
                        refreshOnAccept: true,
                    });
                    if (isProduction) onCancel();
                } else {
                    showAlert({
                        message:
                            result.message ??
                            `Error al registrarse (${response.status} - ${response.statusText})`,
                        error: true,
                    });
                }
            } catch (error) {
                console.error("Error en registro:", error);
                showAlert({
                    message: "Error de conexión. Intenta nuevamente.",
                    error: true,
                });
            } finally {
                setLoading(false);
            }
        },
        [setLoading, showAlert, onCancel],
    );

    const onError = (error) => {
        const keys = Object.keys(error);
        let fields = keys
            // .slice(0, 2)
            .map((key) => FORM_FIELDS_LABELS[key])
            .join(", ");

        if (keys.length >= 3) {
            // fields = `${fields}... y ${keys.length - 2} más`;
            fields = `${fields}`;
        }
        showAlert({
            message: "Por favor verifica los campos: \n" + fields,
            error: true,
            title: "El formulario contiene errores",
        });
        scrollIntoError(keys, formRef);
    };

    const { fields } = useFieldForm(methods, registered);

    return (
        <Dialog fullScreen open>
            <DialogContent
                sx={{
                    p: "0px !important",
                }}
            >
                <Box
                    component="img"
                    src={Banner}
                    alt="Banner"
                    sx={{
                        width: "100%",
                        pb: 1.25,
                    }}
                />
                <Box
                    sx={{
                        px: 2,
                    }}
                >
                    <Stack flexDirection="column" alignItems="center">
                        <Typography
                            variant={registered ? "body1" : "h6"}
                            align="center"
                            sx={{
                                mb: 1,
                            }}
                        >
                            {message?.split("\n").map((line, index) => (
                                <Fragment key={index}>
                                    {line
                                        .split(/(<strong>.*?<\/strong>)/g)
                                        .map((segment, segmentIndex) => {
                                            // Verificar si el segmento está entre etiquetas <strong>
                                            if (
                                                segment.startsWith(
                                                    "<strong>",
                                                ) &&
                                                segment.endsWith("</strong>")
                                            ) {
                                                const strongContent =
                                                    segment.slice(8, -9); // Eliminar <strong> y </strong>
                                                return (
                                                    <strong key={segmentIndex}>
                                                        {strongContent}
                                                    </strong>
                                                );
                                            }
                                            // Texto normal
                                            return segment;
                                        })}
                                    <br />
                                </Fragment>
                            ))}
                        </Typography>
                        <FormProvider {...methods}>
                            <Box
                                sx={{
                                    minWidth: { md: "400px", xs: "100%" },
                                    maxWidth: "100%",
                                }}
                            >
                                {registered ? (
                                    <Grid container spacing={1.25}>
                                        {fields?.map((field, index) => {
                                            const {
                                                Component,
                                                gridless = false,
                                                size = { xs: 12, md: 6 },
                                                // ...props
                                            } = field;

                                            if (!Component) return null;

                                            return gridless ? (
                                                <Component
                                                    key={index}
                                                    slotProps={{
                                                        ...field,
                                                        formRef,
                                                    }}
                                                />
                                            ) : (
                                                <Grid key={index} size={size}>
                                                    <Component
                                                        slotProps={{
                                                            ...field,
                                                            formRef,
                                                        }}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                ) : (
                                    ValidatorFields.map((field, index) => {
                                        const { Component } = field;
                                        return (
                                            <Component
                                                key={index}
                                                slotProps={{
                                                    ...field,
                                                    formRef,
                                                }}
                                            />
                                        );
                                    })
                                )}
                            </Box>
                        </FormProvider>
                        {!registered && (
                            <Button
                                variant="contained"
                                startIcon={
                                    loading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <SearchIcon />
                                    )
                                }
                                disabled={loading}
                                onClick={methods.handleSubmit(onSearch)}
                                sx={{
                                    mb: "19.91px !important",
                                }}
                            >
                                Continuar inscripción
                            </Button>
                        )}
                    </Stack>
                </Box>
                <Box
                    component="img"
                    src={Footer}
                    alt="Banner"
                    sx={{
                        width: "100%",
                        position: { xs: "absolute", md: "relative" },
                        bottom: 0,
                    }}
                />
            </DialogContent>
            {registered && (
                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                        backgroundImage: `url(${getButtonsFooter(
                            "diplomado",
                            small,
                        )})`,
                        backgroundSize: "cover",
                    }}
                >
                    {loading ? (
                        <Stack
                            justifyContent="center"
                            // alignItems="center"
                            sx={{
                                width: "100%",
                                height: "36.5px",
                            }}
                        >
                            <LinearProgress
                                sx={{
                                    width: "100%",
                                }}
                            />
                        </Stack>
                    ) : (
                        <Fragment>
                            <Button
                                onClick={onCancel}
                                variant="text"
                                startIcon={<DeleteForeverIcon />}
                                sx={{
                                    color: "black",
                                    display: {
                                        xs: "none",
                                        md: "flex",
                                    },
                                }}
                            >
                                Limpiar formulario
                            </Button>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: {
                                        xs: "flex",
                                        md: "none",
                                    },
                                }}
                            />
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0}
                                    sx={{
                                        mr: 1,
                                    }}
                                >
                                    <DoubleArrowIcon color="primary" />
                                    <DoubleArrowIcon color="primary" />
                                </Stack>
                                <Button
                                    onClick={handleSubmit(onSubmit, onError)}
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    endIcon={<SaveIcon />}
                                    sx={{
                                        fontWeight: "bold",
                                        px: 4,
                                        boxShadow: 3,
                                        "&:hover": {
                                            boxShadow: 6,
                                            transform: "scale(1.02)",
                                            transition: "all 0.2s ease-in-out",
                                        },
                                        "&:disabled": {
                                            backgroundColor:
                                                "action.disabledBackground",
                                        },
                                    }}
                                >
                                    Registrarse
                                </Button>
                            </Stack>
                        </Fragment>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
}

Validator.propTypes = {
    state: PropTypes.array.isRequired,
};

export default Validator;
