import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRenderCount } from "@uidotdev/usehooks";
import * as Sentry from "@sentry/react";
import dayjs from "dayjs";
import { Fragment, lazy, Suspense, useCallback, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import Redirect from "../../components/Form/Redirect";
import {
    ErrorState,
    LoadingBackdrop,
    LoadingState,
    MessageState,
} from "../../components/ui";
import { getBanner, getFooter } from "../../config/courseAssets";
import useAlert from "../../hooks/alert/useAlertNew";
import useSmall from "../../hooks/breakpoint/useSmall";
import { useCourseSlots } from "../../hooks/useAPI";
import enrollmentService from "../../services/enrollmentService";
import { formDataFromObject } from "../../utils/form";
import { handleSubmitError, safeParseResponse } from "../../utils/http";
import { isDevelopment } from "../../utils/isProduction";
import {
    calculateFormDataSize,
    formatBytes,
    serializeFormDataForSentry,
} from "../../utils/sentry";
import getTimeout from "../../utils/timeout";
import { default as useFieldForm } from "./constant";
import { getFormErrorFields, scrollIntoError } from "./functions";
const Validator = lazy(() => import("../Validator/index"));

export default function FormularioDiplomado() {
    const { isLoading, isValidating, error, isAvailable, hasSlots } =
        useCourseSlots("diplomado-2025-1");

    const [registered, setRegistered] = useState();
    const methods = useForm({ mode: "onBlur" });

    Redirect();

    // Estado de error
    if (error) {
        return <ErrorState error={error} isValidating={isValidating} />;
    }

    // Estado de carga
    if (isLoading) {
        return <LoadingState />;
    }

    // Curso no disponible
    if (!isAvailable) {
        return (
            <MessageState
                title="¡Lo sentimos!"
                message={
                    <>
                        Las inscripciones han finalizado.
                        <br />
                        Gracias por tu interés. ¡Te esperamos en futuras
                        ediciones!
                    </>
                }
            />
        );
    }

    // Sin cupos
    if (!hasSlots) {
        return (
            <MessageState
                title="¡Lo sentimos!"
                message="No hay cupos disponibles para este curso"
            />
        );
    }

    // Mostrar formulario o validador
    return registered === false ? (
        <FormProvider {...methods}>
            <FullScreenDialog />
        </FormProvider>
    ) : (
        <Suspense fallback={<LoadingBackdrop />}>
            <FormProvider {...methods}>
                <Validator state={[registered, setRegistered]} />
            </FormProvider>
        </Suspense>
    );
}

function FullScreenDialog() {
    const formRef = useRef({});

    const [sending, setSending] = useState(false);

    const { showAlert } = useAlert();

    const renderCount = useRenderCount();
    const methods = useFormContext();
    const { handleSubmit } = methods;

    const theme = useTheme();
    const small = useSmall();

    const onCancel = useCallback(() => {
        setSending(true);
        setTimeout(() => location.reload(), 750);
    }, [setSending]);

    const onSubmit = useCallback(
        async (data) => {
            try {
                setSending(true);
                const start = dayjs();

                // Breadcrumb: inicio de envío
                Sentry.addBreadcrumb({
                    category: "form",
                    message: "Iniciando envío de formulario de registro",
                    level: "info",
                    data: {
                        formSize: formatBytes(calculateFormDataSize(data)),
                        hasDocuments:
                            !!data.frontDocument && !!data.backDocument,
                    },
                });

                const formData = formDataFromObject({ ...data });

                // Ejecutar request
                const response = await enrollmentService.register(formData);

                // Mantener delay mínimo para UX (750ms)
                const minDelay = getTimeout(start);
                if (minDelay > 0) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, minDelay),
                    );
                }

                // Verificar estado de la respuesta ANTES de parsear
                if (response.ok) {
                    // Parsear respuesta exitosa
                    const parsed = await safeParseResponse(response);

                    // Validar que la respuesta no esté vacía
                    if (parsed.isEmpty || !parsed.data) {
                        Sentry.addBreadcrumb({
                            category: "form",
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
                                    form_type: "diplomado",
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
                        category: "form",
                        message: "Registro completado exitosamente",
                        level: "info",
                    });

                    showAlert({
                        message:
                            parsed.data?.message ??
                            "Registro completado exitosamente",
                        refreshOnAccept: true,
                    });
                } else {
                    // Manejar error HTTP con función unificada
                    const errorMessage = await handleSubmitError(
                        response,
                        data,
                        {
                            category: "form",
                            formType: "diplomado",
                            alreadyRegistered: false,
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
                    category: "form",
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
                        },
                    },
                    tags: {
                        form_type: "diplomado",
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
                setSending(false);
            }
        },
        [setSending, showAlert],
    );

    const Banner = getBanner("diplomado", small);
    const Footer = getFooter("diplomado", small);

    const { fields } = useFieldForm(methods);

    const onError = useCallback(
        (error) => {
            showAlert(getFormErrorFields(error, fields));
            scrollIntoError(Object.keys(error), formRef);
        },
        [showAlert, formRef, fields],
    );

    return (
        <Fragment>
            {isDevelopment && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 1,
                        right: 1,
                        p: 1,
                        zIndex: theme.zIndex.modal + 1,
                    }}
                >
                    <Typography variant="caption">
                        Render count: {renderCount}
                    </Typography>
                </Box>
            )}
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
                        <FormProvider {...methods}>
                            <Box component="form" autoComplete="one-time-code">
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
                            </Box>
                        </FormProvider>
                        <Stack alignItems="center">
                            <Link href="https://www.freepik.es/vector-gratis/icono-perfil-plano-dibujado-mano_17539369.htm#fromView=search&page=1&position=29&uuid=fa87b794-1c3a-486d-b7a0-5aa2d7a92f9e">
                                Imagen de freepik
                            </Link>
                        </Stack>
                    </Box>
                    <Box
                        component="img"
                        // fetchPriority="high"
                        src={Footer}
                        alt="Banner"
                        sx={{
                            width: "100%",
                            pt: 1.25,
                            mb: "-5px",
                            // aspectRatio: "16:9",
                        }}
                    />
                </DialogContent>
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
                    {sending ? (
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
            </Dialog>
        </Fragment>
    );
}
