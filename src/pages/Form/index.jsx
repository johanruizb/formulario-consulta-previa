import { Turnstile } from "@marsidev/react-turnstile";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
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
import { FORM_FIELDS_LABELS, URI } from "../../components/constant";
import AsyncSelect from "../../components/Fields/AsyncSelect";
import BirthdayField from "../../components/Fields/BirthdayField";
import CheckboxField from "../../components/Fields/ChecboxField";
import PhoneNumber from "../../components/Fields/PhoneNumber";
import BasicSelect from "../../components/Fields/Select";
import BasicTextField from "../../components/Fields/TextField";
import CityBirth from "../../components/Form/CityBirth";
import CityLocation from "../../components/Form/CityLocation";
import DocumentImage from "../../components/Form/DocumentImage";
import LargeQuestion from "../../components/Form/LargeQuestion";
import OtherConnectivity from "../../components/Form/OtherConnectivity";
import OtherGender from "../../components/Form/OtherGender";
import StateBirth from "../../components/Form/StateBirth";
import SimpleAlert from "../../components/SimpleAlert";
import INSCRIPCION from "../../hooks/request/inscripcion";
import { formDataFromObject } from "../../utils/form";
import isProduction, { isDevelopment } from "../../utils/isProduction";
import getTimeout from "../../utils/timeout";

import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import { Navigate, useParams } from "react-router-dom";
import useSWR from "swr";
import useSmall from "../../hooks/breakpoint/useSmall";
import fetcher from "../../hooks/request/config";
import { getBanner, getButtonsFooter, getFooter } from "./functions";
import Chip from "@mui/material/Chip";

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
    const [form] = useLocalStorage("form", {});

    const expires = form.expires ? dayjs(form.expires) : null;
    const isAfter = expires ? dayjs().isAfter(expires) : false;

    // Si expira el form, se limpia
    if (expires && isAfter) return {};
    return form.values;
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
    const { data, isLoading, error } = useSWR(
        URI.API + "/inscripcion/cupos/" + curso,
        fetcher,
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
    ) : data?.curso_disponible === false ? (
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
                Error {error?.status || 500}
            </Typography>
            <Typography variant="h6" textAlign="center">
                Se ha presentado un error al verificar los cupos disponibles
            </Typography>
            {error.statusText && (
                <Chip
                    label={String(error.statusText)
                        .toUpperCase()
                        .replaceAll(" ", "_")}
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        mb: 2,
                    }}
                />
            )}
        </Stack>
    );
}

function FullScreenDialog() {
    const { curso = "20hr" } = useParams();

    const ref = useRef();
    const formRef = useRef({});

    const [disabled, setDisabled] = useState(isProduction);
    const [sending, setSending] = useState(false);

    const [alert, setAlert] = useLocalStorage("alert", {
        open: false,
        message: "",
        severity: "success",
    });

    const onCloseAlert = () => {
        setAlert({ open: false, message: "", severity: "success" });
    };

    const onOpenAlert = (message, severity = "success") => {
        setAlert({ message, open: true, severity });
    };

    const form = useLoadForm();

    const renderCount = useRenderCount();
    const methods = useForm({ mode: "onBlur", defaultValues: form });
    const { reset, handleSubmit } = methods;

    const theme = useTheme();
    const small = useSmall();

    const onCancel = () => {
        setSending(true);
        reset(
            { countryExpedition: "CO" },
            {
                keepValues: false,
                keepDefaultValues: false,
            },
        );
        // window.localStorage.removeItem("form");
        // window.sessionStorage.removeItem("form");
        setTimeout(() => window.location.reload(), 750);
    };

    const onSubmit = (data) => {
        const start = dayjs();
        setSending(true);
        const formData = formDataFromObject({ ...data, curso });
        INSCRIPCION.registrar(formData)
            .then((response) => {
                const timeout = getTimeout(start);

                setTimeout(() => {
                    if (response.ok) {
                        response.json().then((data) => {
                            onOpenAlert(data.message);
                            // if (isProduction) onCancel();
                            onCancel();
                        });
                    } else {
                        response
                            ?.json()
                            .then((data) => {
                                onOpenAlert(
                                    data.message ||
                                        "Algo ha fallado al registrarse",
                                    "error",
                                );
                            })
                            .catch(() => {
                                onOpenAlert(
                                    "Algo ha fallado al registrarse",
                                    "error",
                                );
                            })
                            .finally(() => {
                                onExpire();
                            });
                        setSending(false);
                    }
                }, timeout);
            })
            .catch(() => {
                onOpenAlert("Algo ha fallado al registrarse", "error");
                setSending(false);
            });
    };

    const onError = (error) => {
        const keys = Object.keys(error);

        let fields = keys
            .slice(0, 2)
            .map((key) => FORM_FIELDS_LABELS[key])
            .join(", ");

        if (keys.length >= 3) {
            fields = `${fields}... y ${keys.length - 2} más`;
        }
        onOpenAlert("Por favor verifica los campos: " + fields, "error");
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

    if (!["20hr", "20hr-institucional"].includes(curso))
        return <Navigate to="/" />;

    return (
        <Fragment>
            <SimpleAlert {...alert} onClose={onCloseAlert} />
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
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicTextField
                                            slotProps={{
                                                controller: {
                                                    name: "firstName",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                        pattern: {
                                                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                            message:
                                                                "Por favor verifica el nombre",
                                                        },
                                                        maxLength: {
                                                            value: 150,
                                                            message:
                                                                "El nombre no puede tener más de 150 caracteres",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Nombres",
                                                    required: true,
                                                    onChange: (
                                                        e,
                                                        onChangeController,
                                                    ) =>
                                                        onChangeController(
                                                            (
                                                                e.target
                                                                    .value || ""
                                                            ).toUpperCase(),
                                                        ),
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicTextField
                                            slotProps={{
                                                controller: {
                                                    name: "lastName",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                        pattern: {
                                                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                            message:
                                                                "Por favor verifica el apellido",
                                                        },
                                                        maxLength: {
                                                            value: 150,
                                                            message:
                                                                "El apellido no puede tener más de 150 caracteres",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Apellidos",
                                                    required: true,
                                                    onChange: (
                                                        e,
                                                        onChangeController,
                                                    ) =>
                                                        onChangeController(
                                                            (
                                                                e.target
                                                                    .value || ""
                                                            ).toUpperCase(),
                                                        ),
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicSelect
                                            slotProps={{
                                                controller: {
                                                    name: "identityDocument",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    options: [
                                                        {
                                                            value: 1,
                                                            label: "(CC) Cédula de ciudadanía",
                                                        },
                                                        {
                                                            value: 2,
                                                            label: "(CE) Cédula de extranjería",
                                                        },
                                                        {
                                                            value: 3,
                                                            label: "(PA) Pasaporte",
                                                        },
                                                        {
                                                            value: 4,
                                                            label: "(PR) Permiso de residencia",
                                                        },
                                                        {
                                                            value: 5,
                                                            label: "(TI) Tarjeta de identidad",
                                                        },
                                                    ],
                                                    label: "Tipo de documento de identidad",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicTextField
                                            slotProps={{
                                                controller: {
                                                    name: "documentNumber",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                        maxLength: {
                                                            value: 20,
                                                            message:
                                                                "El número de documento no puede tener más de 20 caracteres",
                                                        },
                                                        pattern: {
                                                            value: /^[^.,\s]+$/,
                                                            message:
                                                                "El número de documento no puede tener espacios, puntos o comas",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Número de documento",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <AsyncSelect
                                            fetchProps={{
                                                url: `${URI.FORM}/v1/countries`,
                                            }}
                                            slotProps={{
                                                controller: {
                                                    name: "countryExpedition",
                                                    defaultValue: "CO",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "País de expedición",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <DocumentImage formRef={formRef} />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BirthdayField
                                            slotProps={{
                                                controller: {
                                                    name: "birthdate",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Fecha de nacimiento",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <AsyncSelect
                                            fetchProps={{
                                                url: `${URI.FORM}/v1/countries`,
                                            }}
                                            slotProps={{
                                                controller: {
                                                    name: "countryBirth",
                                                    defaultValue: "CO",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "País de nacimiento",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <StateBirth formRef={formRef} />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <CityBirth formRef={formRef} />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicSelect
                                            slotProps={{
                                                controller: {
                                                    name: "gender",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    options: [
                                                        {
                                                            value: 1,
                                                            label: "Femenino",
                                                        },
                                                        {
                                                            value: 2,
                                                            label: "Masculino",
                                                        },
                                                        {
                                                            value: 3,
                                                            label: "Transgénero",
                                                        },
                                                        {
                                                            value: 4,
                                                            label: "No binario",
                                                        },
                                                        {
                                                            value: 5,
                                                            label: "Prefiero no decirlo",
                                                        },
                                                        {
                                                            value: 0,
                                                            label: "Otro (especifique)",
                                                        },
                                                    ],
                                                    label: "Género",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <OtherGender formRef={formRef} />
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicSelect
                                            slotProps={{
                                                controller: {
                                                    name: "ethnicity",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    options: [
                                                        {
                                                            value: 1,
                                                            label: "Indígena",
                                                        },
                                                        {
                                                            value: 2,
                                                            label: "Mestizo",
                                                        },
                                                        {
                                                            value: 3,
                                                            label: "Blanco",
                                                        },
                                                        {
                                                            value: 4,
                                                            label: "Rom",
                                                        },
                                                        {
                                                            value: 5,
                                                            label: "Raizal del Archipiélago de San Andrés y Providencia",
                                                        },
                                                        {
                                                            value: 6,
                                                            label: "Palenquero de San Basilio",
                                                        },
                                                        {
                                                            value: 7,
                                                            label: "Negro(a), afrocolombiano(a) o afrodescendiente",
                                                        },
                                                        {
                                                            value: 8,
                                                            label: "Mulato(a)",
                                                        },
                                                        {
                                                            value: 9,
                                                            label: "Ninguno de los anteriores",
                                                        },
                                                    ],
                                                    label: "Grupo poblacional",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicTextField
                                            slotProps={{
                                                controller: {
                                                    name: "entityName",
                                                    defaultValue: "",
                                                    rules: {
                                                        maxLength: {
                                                            value: 300,
                                                            message:
                                                                "El nombre no puede tener más de 300 caracteres",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Nombre de la entidad u organización que representa",
                                                    onChange: (
                                                        e,
                                                        onChangeController,
                                                    ) =>
                                                        onChangeController(
                                                            (
                                                                e.target
                                                                    .value || ""
                                                            ).toUpperCase(),
                                                        ),
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicSelect
                                            slotProps={{
                                                controller: {
                                                    name: "typeEntity",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    options: [
                                                        {
                                                            value: 1,
                                                            label: "Comunidad Negro(a) afrocolombiano(a) o afrodescendiente",
                                                        },
                                                        {
                                                            value: 2,
                                                            label: "Comunidad Indígena",
                                                        },
                                                        {
                                                            value: 3,
                                                            label: "Ejecutores de procesos Consulta Previa",
                                                        },
                                                        {
                                                            value: 4,
                                                            label: "Institucionalidad interviniente en Consulta Previa",
                                                        },
                                                        {
                                                            value: 5,
                                                            label: "Contratista del Estado",
                                                        },
                                                        {
                                                            value: 6,
                                                            label: "Funcionarios Ministerio del Interior",
                                                        },
                                                        {
                                                            value: 7,
                                                            label: "Población civil",
                                                        },
                                                        {
                                                            value: 8,
                                                            label: "Empresario",
                                                        },
                                                        {
                                                            value: 9,
                                                            label: "Educación",
                                                        },
                                                    ],
                                                    label: "De los siguientes roles en cuál se reconoce?",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <PhoneNumber
                                            slotProps={{
                                                controller: {
                                                    name: "phoneNumber",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Número de teléfono - WhatsApp",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    {/* <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <PhoneNumber
                                            slotProps={{
                                                controller: {
                                                    name: "whatsappNumber",
                                                    defaultValue: "",
                                                },
                                                field: {
                                                    label: "Número de WhatsApp",
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid> */}
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicTextField
                                            slotProps={{
                                                controller: {
                                                    name: "email",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                        pattern: {
                                                            value: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                                                            message:
                                                                "Por favor verifica el correo",
                                                        },
                                                        maxLength: {
                                                            value: 300,
                                                            message:
                                                                "El correo no puede tener más de 300 caracteres",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Correo electrónico",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <AsyncSelect
                                            fetchProps={{
                                                url: `${URI.FORM}/v1/countries/CO/states`,
                                            }}
                                            slotProps={{
                                                controller: {
                                                    name: "stateLocation",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Departamento de residencia",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <CityLocation formRef={formRef} />
                                    </Grid>
                                    {/* <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicTextField
                                            slotProps={{
                                                controller: {
                                                    name: "address",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Dirección de residencia",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid> */}
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicTextField
                                            slotProps={{
                                                controller: {
                                                    name: "neighborhood",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                        maxLength: {
                                                            value: 300,
                                                            message:
                                                                "El barrio no puede tener más de 300 caracteres",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    label: "Barrio de residencia",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicSelect
                                            slotProps={{
                                                controller: {
                                                    name: "zona",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    options: [
                                                        {
                                                            value: "rural",
                                                            label: "Rural",
                                                        },
                                                        {
                                                            value: "urbana",
                                                            label: "Urbana",
                                                        },
                                                    ],
                                                    label: "Zona de residencia",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <BasicSelect
                                            slotProps={{
                                                controller: {
                                                    name: "connectivity",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Este campo no puede estar vacio",
                                                        },
                                                    },
                                                },
                                                field: {
                                                    options: [
                                                        {
                                                            value: "nula",
                                                            label: "Sin conexión",
                                                        },
                                                        {
                                                            value: "baja",
                                                            label: "Solo con wifi público",
                                                        },
                                                        {
                                                            value: "media",
                                                            label: "Por intervalos de tiempo con dificultad",
                                                        },
                                                        {
                                                            value: "plena",
                                                            label: "Todo el día sin dificultad",
                                                        },
                                                        {
                                                            value: "otra",
                                                            label: "Otra (especificar)",
                                                        },
                                                    ],
                                                    label: "Acceso a conexión de internet",
                                                    required: true,
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <OtherConnectivity formRef={formRef} />
                                    <Grid size={12}>
                                        <LargeQuestion
                                            slotProps={{
                                                controller: {
                                                    name: "continuar_curso_120",
                                                    defaultValue: "",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Es necesario responder la pregunta para continuar",
                                                        },
                                                    },
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        display="flex"
                                        justifyContent="center"
                                        size={12}
                                    >
                                        <CheckboxField
                                            slotProps={{
                                                controller: {
                                                    name: "processingOfPersonalData",
                                                    rules: {
                                                        required: {
                                                            value: true,
                                                            message:
                                                                "Es necesario marcar la casilla para continuar",
                                                        },
                                                    },
                                                },
                                                formRef,
                                            }}
                                        />
                                    </Grid>
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
                                // color="white"
                                sx={{
                                    color: "white",
                                }}
                            >
                                Limpiar formulario
                            </Button>
                            <Button
                                onClick={handleSubmit(onSubmit, onError)}
                                endIcon={<SaveIcon />}
                                disabled={disabled}
                                sx={{
                                    color: "white",
                                }}
                            >
                                Registrarse
                            </Button>
                        </Fragment>
                    )}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
