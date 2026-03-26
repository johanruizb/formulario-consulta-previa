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
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import * as Sentry from "@sentry/react";
import PropTypes from "prop-types";
import { Fragment, useCallback, useRef, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import { getBanner, getFooter } from "../../config/courseAssets";
import { useAlert } from "../../hooks/alert/useAlertNew";
import useSmall from "../../hooks/breakpoint/useSmall";
import INSCRIPCION from "../../hooks/request/inscripcion";
import SEARCH from "../../hooks/request/search";
import { formDataFromObject } from "../../utils/form";
import { handleSubmitError, safeParseResponse } from "../../utils/http";
import isProduction from "../../utils/isProduction";
import {
    calculateFormDataSize,
    formatBytes,
    serializeFormDataForSentry,
} from "../../utils/sentry";
import useFieldForm from "../Form/constant";
import { getFormErrorFields, scrollIntoError } from "../Form/functions";
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

                // Breadcrumb: inicio de búsqueda
                Sentry.addBreadcrumb({
                    category: "validator",
                    message: "Iniciando búsqueda de usuario",
                    level: "info",
                    data: {
                        documentNumber:
                            data.documentNumber?.substring(0, 4) + "***",
                    },
                });

                const response = await SEARCH.verify(data);
                // Parsear respuesta de forma segura ANTES del switch
                const parsed = await safeParseResponse(response);

                switch (parsed.status) {
                    case 200:
                        // Usuario encontrado - validar que tenga datos
                        if (!parsed.data || !parsed.data.persona) {
                            Sentry.captureException(
                                new Error(
                                    "Respuesta 200 en búsqueda pero sin datos de persona",
                                ),
                                {
                                    contexts: {
                                        response: {
                                            status: parsed.status,
                                            isEmpty: parsed.isEmpty,
                                            hasData: !!parsed.data,
                                        },
                                    },
                                    tags: {
                                        form_type: "validator",
                                        error_type: "search_empty_data",
                                    },
                                },
                            );

                            showAlert({
                                message:
                                    "Error al obtener datos del usuario. Por favor, intenta nuevamente.",
                                error: true,
                            });
                            break;
                        }

                        // Usuario encontrado - llenar formulario con datos
                        Sentry.addBreadcrumb({
                            category: "validator",
                            message: "Usuario encontrado en el sistema",
                            level: "info",
                        });
                        setMessage(null);
                        setRegistered(true);
                        reset(parsed.data.persona);
                        break;

                    case 404:
                        // Usuario no encontrado - limpiar y permitir registro
                        Sentry.addBreadcrumb({
                            category: "validator",
                            message: "Usuario no encontrado - nuevo registro",
                            level: "info",
                        });
                        setRegistered(false);
                        reset({
                            documentNumber: data.documentNumber,
                        });
                        break;

                    default:
                        // Ya inscrito u otros casos
                        Sentry.addBreadcrumb({
                            category: "validator",
                            message: `Error en búsqueda: ${parsed.status}`,
                            level: "warning",
                            data: {
                                status: parsed.status,
                                message: parsed.data?.message,
                                hasJSON: !!parsed.data,
                            },
                        });

                        // Capturar en Sentry si no hay JSON válido
                        if (!parsed.data && parsed.rawBody) {
                            Sentry.captureException(
                                new Error(
                                    `Error de búsqueda sin JSON: ${parsed.status}`,
                                ),
                                {
                                    contexts: {
                                        search: {
                                            documentNumber:
                                                data.documentNumber?.substring(
                                                    0,
                                                    4,
                                                ) + "***",
                                            status: parsed.status,
                                            statusText: parsed.statusText,
                                        },
                                        rawResponse: {
                                            preview: parsed.rawBody.substring(
                                                0,
                                                500,
                                            ),
                                            truncated:
                                                parsed.rawBody.length > 500,
                                        },
                                    },
                                    tags: {
                                        form_type: "validator",
                                        error_type: "search_no_json",
                                        status_code: parsed.status.toString(),
                                    },
                                },
                            );
                        }

                        showAlert({
                            title: "Ya te has inscrito!",
                            message:
                                parsed.data?.message ??
                                "Error al buscar usuario en el sistema",
                            error: true,
                            refreshOnAccept: true,
                        });
                        break;
                }
            } catch (error) {
                // Capturar errores de red en búsqueda
                const isNetworkError = error instanceof TypeError;
                const isTimeout =
                    error.name === "AbortError" ||
                    error.name === "TimeoutError";

                Sentry.captureException(error, {
                    contexts: {
                        search: {
                            documentNumber:
                                data.documentNumber?.substring(0, 4) + "***",
                            errorType: isTimeout
                                ? "timeout"
                                : isNetworkError
                                  ? "network"
                                  : "unknown",
                        },
                    },
                    tags: {
                        form_type: "validator",
                        error_type: isTimeout
                            ? "search_timeout_error"
                            : isNetworkError
                              ? "search_network_error"
                              : "search_error",
                    },
                });

                showAlert({
                    message: isTimeout
                        ? "La búsqueda tardó demasiado tiempo. Por favor, intenta nuevamente."
                        : isNetworkError
                          ? "Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente."
                          : "Error al buscar usuario. Por favor, intenta nuevamente.",
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

                // Breadcrumb: inicio de registro
                Sentry.addBreadcrumb({
                    category: "validator",
                    message: "Iniciando registro de usuario existente",
                    level: "info",
                    data: {
                        formSize: formatBytes(calculateFormDataSize(data)),
                        hasDocuments:
                            !!data.frontDocument && !!data.backDocument,
                    },
                });

                const formData = formDataFromObject({
                    ...data,
                    processingOfPersonalData: true,
                    alreadyRegistered: true,
                });

                const response = await INSCRIPCION.registrar(formData);

                // Verificar estado de la respuesta ANTES de parsear
                if (response.ok) {
                    // Parsear respuesta exitosa
                    const parsed = await safeParseResponse(response);

                    // Validar que la respuesta no esté vacía
                    if (parsed.isEmpty || !parsed.data) {
                        Sentry.addBreadcrumb({
                            category: "validator",
                            message: "Respuesta exitosa pero vacía",
                            level: "warning",
                            data: {
                                isEmpty: parsed.isEmpty,
                                hasData: !!parsed.data,
                            },
                        });

                        Sentry.captureException(
                            new Error("Respuesta 200 OK pero contenido vacío"),
                            {
                                contexts: {
                                    response: {
                                        status: parsed.status,
                                        contentType: parsed.contentType,
                                        isEmpty: parsed.isEmpty,
                                    },
                                },
                                tags: {
                                    form_type: "validator",
                                    error_type: "empty_success_response",
                                },
                            },
                        );

                        showAlert({
                            message:
                                "El servidor no respondió correctamente. Por favor, intenta nuevamente.",
                            error: true,
                        });
                        return;
                    }

                    // Breadcrumb: éxito
                    Sentry.addBreadcrumb({
                        category: "validator",
                        message: "Registro completado exitosamente",
                        level: "info",
                    });

                    showAlert({
                        message:
                            parsed.data?.message ??
                            "Registro completado exitosamente",
                        refreshOnAccept: true,
                    });
                    if (isProduction) onCancel();
                } else {
                    // Manejar error HTTP con función unificada
                    const errorMessage = await handleSubmitError(
                        response,
                        data,
                        {
                            category: "validator",
                            formType: "validator",
                            alreadyRegistered: true,
                        },
                    );

                    showAlert({
                        message: errorMessage,
                        error: true,
                    });
                }
            } catch (error) {
                // Capturar errores de red o excepciones inesperadas
                const isNetworkError = error instanceof TypeError;
                const isTimeout =
                    error.name === "AbortError" ||
                    error.name === "TimeoutError";
                const errorType = isTimeout
                    ? "timeout_error"
                    : isNetworkError
                      ? "network_error"
                      : "unknown_error";

                Sentry.addBreadcrumb({
                    category: "validator",
                    message: isTimeout
                        ? "Timeout: La solicitud tardó demasiado"
                        : isNetworkError
                          ? "Error de red (sin conexión)"
                          : "Excepción no controlada",
                    level: "error",
                    data: {
                        errorName: error.name,
                        errorMessage: error.message,
                    },
                });

                Sentry.captureException(error, {
                    contexts: {
                        formData: {
                            ...serializeFormDataForSentry(data),
                            totalSize: formatBytes(calculateFormDataSize(data)),
                            alreadyRegistered: true,
                        },
                    },
                    tags: {
                        form_type: "validator",
                        error_type: errorType,
                    },
                });

                showAlert({
                    message: isTimeout
                        ? "La solicitud tardó demasiado tiempo. Por favor, verifica tu conexión e intenta nuevamente."
                        : isNetworkError
                          ? "Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente."
                          : "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.",
                    error: true,
                });
            } finally {
                setLoading(false);
            }
        },
        [setLoading, showAlert, onCancel],
    );

    const { fields } = useFieldForm(methods, registered);

    const onError = (error) => {
        showAlert(getFormErrorFields(error, fields));
        scrollIntoError(Object.keys(error), formRef);
    };

    return (
        <Dialog fullScreen open>
            <DialogContent
                sx={{
                    p: "0px !important",
                }}
            >
                <Box
                    component="img"
                    // fetchPriority="high"
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
                    // fetchPriority="high"
                    sx={{
                        width: "100%",
                        // position: { xs: "absolute", md: "relative" },
                        // bottom: 0,
                    }}
                />
            </DialogContent>
            {registered && (
                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                        // backgroundImage: `url(${getButtonsFooter(
                        //     "diplomado",
                        //     small,
                        // )})`,
                        // backgroundSize: "cover",
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
                                    // color: "black",
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
