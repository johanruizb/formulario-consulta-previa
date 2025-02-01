import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import useSmall from "../../hooks/breakpoint/useSmall";
import {
    getBanner,
    getButtonsFooter,
    getFooter,
    scrollIntoError,
    useLoadForm,
    useSaveForm,
} from "../Form/functions";

import { Turnstile } from "@marsidev/react-turnstile";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import LinearProgress from "@mui/material/LinearProgress";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Fragment, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FORM_FIELDS_LABELS } from "../../components/constant";
import useAlert from "../../hooks/alert/useAlert";
import useLoading from "../../hooks/loading/useLoading";
import INSCRIPCION from "../../hooks/request/inscripcion";
import SEARCH from "../../hooks/request/search";
import { formDataFromObject } from "../../utils/form";
import isProduction from "../../utils/isProduction";
import ValidatorFields, { AlredyRegisteredFields } from "./constants";

const DEFAULT_MESSAGE = "Por favor, ingresa el número de tu cédula";

function Save() {
    useSaveForm();
    return null;
}

function Validator({ state }) {
    const [registered, setRegistered] = state;
    const { curso = "diplomado" } = useParams();

    const ref = useRef(null);
    const formRef = useRef({});

    const small = useSmall();

    const [disabled, setDisabled] = useState(isProduction);

    const Banner = getBanner(curso, small);
    const Footer = getFooter(curso, small);

    const [form, saveForm] = useLoadForm();
    const methods = useForm({
        mode: "onBlur",
        defaultValues: form,
    });

    const [message, setMessage] = useState(DEFAULT_MESSAGE);

    const { onOpen: setAlert } = useAlert();
    const { loading, start, finish } = useLoading();

    const onSearch = (data) => {
        start(dayjs());
        SEARCH.verify(data).then((response) => {
            response
                .json()
                .then((data) => {
                    if (response.ok)
                        finish(() => {
                            if (response.status === 200) {
                                // setAlert({
                                //     title: "Inscripción encontrada",
                                //     message: data.message,
                                // });
                                setMessage(null);
                                setRegistered(response.ok);
                                methods.reset(data.persona);
                                // ref.current?.reset();
                            } else
                                setAlert({
                                    title: "Ya te has inscrito!",
                                    message: data.message,
                                    error: true,
                                });
                        });
                    else {
                        if (response.status === 404) setRegistered(response.ok);
                    }
                })
                .finally(() => {
                    setDisabled(true);
                    ref.current?.reset();
                });
        });
    };

    const onCancel = () => {
        saveForm({});
        setTimeout(() => location.reload(), 750);
    };

    const onSubmit = (data) => {
        start(dayjs());
        const formData = formDataFromObject({
            ...data,
            alreadyRegistered: true,
        });
        INSCRIPCION.registrar(formData)
            .then((response) =>
                finish(() => {
                    response
                        .json()
                        .then((res) => {
                            if (response.ok) {
                                setAlert({
                                    message: res.message,
                                });
                                if (isProduction) onCancel();
                            } else {
                                console.log(res.message);

                                setAlert({
                                    message:
                                        res.message ??
                                        `Algo ha fallado al registrarse (${
                                            response.status
                                        }_${response.statusText.toUpperCase()})`,
                                    error: true,
                                });
                            }
                        })
                        .catch(() => {
                            setAlert({
                                message:
                                    "No se ha obtenido respuesta del servidor",
                                error: true,
                            });
                            onExpire();
                        });
                }),
            )
            .catch(() =>
                finish(() =>
                    setAlert({
                        message: "Ha ocurrido un error en el servidor",
                        error: true,
                    }),
                ),
            );
    };

    const onSuccess = (token) => {
        setDisabled(false);
        methods.setValue("turnstile_token", token);
    };

    const onExpire = () => {
        setDisabled(true);
        ref.current?.reset();
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
        setAlert({
            message: "Por favor verifica los campos: \n" + fields,
            error: true,
            title: "El formulario contiene errores",
        });
        scrollIntoError(keys, formRef);
        onExpire();
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
                        {/* <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            mb: 1,
                        }}
                    >
                        
                        Por favor, ingresa el número de tu cédula para validar
                        si ya te has inscrito previamente
                    </Typography> */}
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
                                    // AlredyRegisteredFields.map((field, index) => {
                                    //       const { Component } = field;
                                    //       return (
                                    //           <Component
                                    //               key={index}
                                    //               slotProps={{
                                    //                   ...field,
                                    //                   formRef,
                                    //               }}
                                    //           />
                                    //       );
                                    //   })
                                    <Grid container spacing={1.25}>
                                        {AlredyRegisteredFields?.map(
                                            (field, index) => {
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
                                                    <Grid
                                                        key={index}
                                                        size={size}
                                                    >
                                                        <Component
                                                            slotProps={{
                                                                ...field,
                                                                formRef,
                                                            }}
                                                        />
                                                    </Grid>
                                                );
                                            },
                                        )}
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
                            <Save />
                        </FormProvider>
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
                                    : // : "0x4AAAAAAAiIgbhjquURIMbK"
                                      "1x00000000000000000000AA"
                            }
                            sx={{
                                mb: "19.91px !important",
                                mt: "0 !important",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        />
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
                                disabled={disabled || loading}
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
                    }}
                />
            </DialogContent>
            {registered && (
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
                                onClick={methods.handleSubmit(
                                    onSubmit,
                                    onError,
                                )}
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
            )}
        </Dialog>
    );
}

Validator.propTypes = {
    state: PropTypes.array.isRequired,
};

export default Validator;
