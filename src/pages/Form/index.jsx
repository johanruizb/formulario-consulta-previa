import { Turnstile } from "@marsidev/react-turnstile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WarningIcon from "@mui/icons-material/Warning";

import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { useLocalStorage, useRenderCount } from "@uidotdev/usehooks";
import dayjs from "dayjs";

import { Fragment, useEffect, useRef, useState } from "react";
import {
    FormProvider,
    useForm,
    useFormContext,
    useWatch,
} from "react-hook-form";
import { useParams } from "react-router-dom";

import useSWR from "swr";

import { FORM_FIELDS_LABELS, URI } from "../../components/constant";
import Redirect from "../../components/Form/Redirect";
import Loging from "../../components/Loging";
import useSmall from "../../hooks/breakpoint/useSmall";
import fetcher from "../../hooks/request/config";
import INSCRIPCION from "../../hooks/request/inscripcion";
import { formDataFromObject } from "../../utils/form";
import isProduction, { isDevelopment } from "../../utils/isProduction";
import getTimeout from "../../utils/timeout";
import Formularios from "./constant";
import { getBanner, getButtonsFooter, getFooter } from "./functions";
import DialogMessage from "./Success";

const sortedFields = [
    "firstName",
    "lastName",
    "identityDocument",
    "documentNumber",
    "countryExpedition",
    "frontDocument",
    "backDocument",
    "birthdate",
    "countryBirth",
    "stateBirth",
    "cityBirth",
    "gender",
    "ethnicity",
    "entityName",
    "typeEntity",
    "phoneNumber",
    "whatsappNumber",
    "email",
    "stateLocation",
    "address",
    "neighborhood",
    "zona",
    "connectivity",
    "continuar_curso_120",
    "processingOfPersonalData",
];

function useLoadForm() {
    const [form, saveForm] = useLocalStorage("form", {});

    const expires = form.expires ? dayjs(form.expires) : null;
    const isAfter = expires ? dayjs().isAfter(expires) : false;

    // Si expira el form, se limpia
    if (expires && isAfter) return [{}, saveForm];
    return [form.values, saveForm];
}

function useSaveForm() {
    const { control } = useFormContext();
    const values = useWatch({ control });

    useEffect(() => {
        const saveImage = async () => {
            values.frontDocument = null;
            values.backDocument = null;

            localStorage.setItem(
                "form",
                JSON.stringify({
                    values,
                    expires: dayjs().add(1, "hour").format(),
                }),
            );
        };

        saveImage();
    }, [values]);
}

function Save() {
    useSaveForm();
    return null;
}

function scrollIntoError(keys, formRef) {
    for (const field of sortedFields)
        if (keys.includes(field)) {
            formRef.current[field]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            break;
        }
}

//

export default function FormularioRegistro() {
    const { curso = "20hr" } = useParams();
    const { data, isLoading, isValidating, error } = useSWR(
        URI.API + "/inscripcion/cupos/" + curso,
        fetcher,
    );

    Redirect();

    if (error)
        return (
            <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.25}>
                    <Typography
                        // variant="h4"
                        textAlign="center"
                        fontFamily="monospace"
                        sx={{
                            fontWeight: "bold",
                            fontSize: 24,
                        }}
                    >
                        Error {error?.status || -1}
                    </Typography>
                    {isValidating ? (
                        <CircularProgress size={24} />
                    ) : (
                        <WarningIcon
                            color="warning"
                            sx={{
                                fontSize: 24,
                            }}
                        />
                    )}
                </Stack>
                <Typography
                    // variant="h6"
                    textAlign="center"
                    fontFamily="monospace"
                >
                    Lo sentimos, ha ocurrido un error inesperado en el servidor.
                    Por favor, inténtalo de nuevo más tarde.
                </Typography>
                <Loging error={error} visible />
            </Stack>
        );

    return isLoading ? (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
            }}
        >
            <CircularProgress />
        </Stack>
    ) : data?.curso_disponible === true ? (
        <FullScreenDialog />
    ) : (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
                position: "fixed",
                width: "100%",
                height: "100%",
            }}
        >
            <Typography variant="h4" textAlign="center">
                ¡Lo sentimos!
            </Typography>
            <Typography variant="h6" textAlign="center">
                No hay cupos disponibles para este curso
            </Typography>
        </Stack>
    );
}

function FullScreenDialog() {
    const { curso = "20hr" } = useParams();

    const ref = useRef();
    const formRef = useRef({});

    const [disabled, setDisabled] = useState(isProduction);
    const [sending, setSending] = useState(false);

    const [, setMessage] = useLocalStorage("DialogMessage", null); // {message: "string", error: "boolean"}

    const [form, saveForm] = useLoadForm();

    const renderCount = useRenderCount();
    const methods = useForm({ mode: "onBlur", defaultValues: form });
    const { handleSubmit } = methods;

    const theme = useTheme();
    const small = useSmall();

    const onCancel = () => {
        setSending(true);
        saveForm({});
        setTimeout(() => location.reload(), 750);
    };

    const onOpenAlert = (message, error = false, title) => {
        setMessage({ message, error, title });
    };

    const onSubmit = (data) => {
        if (isProduction) setSending(true);
        const start = dayjs();

        const formData = formDataFromObject({ ...data, curso });

        INSCRIPCION.registrar(formData)
            .then((response) => {
                setTimeout(async () => {
                    if (response.ok) {
                        const res = await response.json();
                        onOpenAlert(
                            res.message ??
                                "Sus datos han sido registrados. El equipo del proyecto se pondrá en contacto con usted en los próximos días para brindarle más información",
                        );
                        if (isProduction) onCancel();
                    } else {
                        response
                            ?.json()
                            .then((data) => {
                                onOpenAlert(
                                    data.message ??
                                        `Algo ha fallado al registrarse (${
                                            response.status
                                        }_${response.statusText.toUpperCase()})`,
                                    true,
                                );
                            })
                            .catch(() => {
                                onOpenAlert(
                                    "No se ha obtenido respuesta del servidor",
                                    true,
                                );
                            })
                            .finally(() => {
                                onExpire();
                            });
                        setSending(false);
                    }
                }, getTimeout(start));
            })
            .catch(() => {
                onOpenAlert("Ha ocurrido un error en el servidor", true);
                setSending(false);
            });
    };

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
        onOpenAlert(
            "Por favor verifica los campos: \n" + fields,
            "error",
            "El formulario contiene errores",
        );
        scrollIntoError(keys, formRef);
    };

    const onSuccess = (token) => {
        setDisabled(false);
        methods.setValue("turnstile_token", token);
    };

    const onExpire = () => {
        setDisabled(true);
        ref.current?.reset();
    };

    const Banner = getBanner(curso, small);
    const Footer = getFooter(curso, small);

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
                                    {Formularios[curso]?.map((field, index) => {
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
                                    <Grid size={12}>
                                        <Box
                                            component={Turnstile}
                                            onSuccess={onSuccess}
                                            onExpire={onExpire}
                                            options={{
                                                theme: "light",
                                                refreshExpired: "manual",
                                            }}
                                            ref={ref}
                                            label={`form_button_${window.location.hostname}`}
                                            siteKey={
                                                isProduction
                                                    ? "0x4AAAAAAAiIftnN7i8Mr-yd"
                                                    : "0x4AAAAAAAiIgbhjquURIMbK"
                                            }
                                            sx={{
                                                mb: 2,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Save />
                        </FormProvider>
                        <Stack alignItems="center">
                            <Link href="https://www.freepik.es/vector-gratis/icono-perfil-plano-dibujado-mano_17539369.htm#fromView=search&page=1&position=29&uuid=fa87b794-1c3a-486d-b7a0-5aa2d7a92f9e">
                                Imagen de freepik
                            </Link>
                        </Stack>
                    </Box>
                    <Box
                        component="img"
                        src={Footer}
                        alt="Banner"
                        sx={{
                            width: "100%",
                            pt: 1.25,
                            mb: "-5px",
                        }}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: "space-between",
                        backgroundImage: `url(${getButtonsFooter(
                            curso,
                            small,
                        )})`,
                        backgroundSize: "cover",
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
                                startIcon={<DeleteForeverIcon />}
                                sx={{
                                    color: window.location.pathname.includes(
                                        "20hr",
                                    )
                                        ? "white"
                                        : "black",
                                }}
                            >
                                Limpiar formulario
                            </Button>
                            <Button
                                onClick={handleSubmit(onSubmit, onError)}
                                endIcon={<SaveIcon />}
                                disabled={disabled}
                                sx={{
                                    color: window.location.pathname.includes(
                                        "20hr",
                                    )
                                        ? "white"
                                        : "black",
                                }}
                            >
                                Registrarse
                            </Button>
                        </Fragment>
                    )}
                </DialogActions>
            </Dialog>
            <DialogMessage />
        </Fragment>
    );
}
