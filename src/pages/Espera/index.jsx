import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import SaveIcon from "@mui/icons-material/Save";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FORM_FIELDS_LABELS } from "../../components/constant";
import {
    getBanner,
    getButtonsFooter,
    getFooter,
} from "../../config/courseAssets";
import { useAlert } from "../../hooks/alert/useAlertNew";
import useSmall from "../../hooks/breakpoint/useSmall";
import INSCRIPCION from "../../hooks/request/inscripcion";
import isProduction from "../../utils/isProduction";
import { scrollIntoError } from "../Form/functions";
import WaitListFields from "./constants";

function ListaEspera() {
    const { curso = "diplomado" } = useParams();
    const formRef = useRef({});
    const small = useSmall();

    const [loading, setLoading] = useState(false);

    const Banner = getBanner(curso, small);
    const Footer = getFooter(curso, small);

    const methods = useForm({
        mode: "onBlur",
    });

    const { showAlert } = useAlert();

    const onCancel = () => {
        setTimeout(() => location.reload(), 750);
    };

    const onSubmit = (data) => {
        setLoading(true);
        INSCRIPCION.espera(data)
            .then((response) =>
                response
                    .json()
                    .then((res) => {
                        if (response.ok) {
                            showAlert({
                                message: res.message,
                                refreshOnAccept: true,
                            });
                            if (isProduction) onCancel();
                        } else {
                            showAlert({
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
                        showAlert({
                            message: "No se ha obtenido respuesta del servidor",
                            error: true,
                        });
                    }),
            )
            .catch(() =>
                showAlert({
                    message: "Ha ocurrido un error en el servidor",
                    error: true,
                }),
            )
            .finally(() => setLoading(false));
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
        showAlert({
            message: "Por favor verifica los campos: \n" + fields,
            error: true,
            title: "El formulario contiene errores",
        });
        scrollIntoError(keys, formRef);
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
                        <Typography
                            variant={"h6"}
                            align="center"
                            sx={{
                                mb: 1,
                            }}
                        >
                            Agradecemos su interes en el proceso de formación en
                            Consulta Previa. Las inscripciones al Diplomado
                            actualmente están cerradas. Si desea, le invitamos a
                            dejar sus datos para contactarle en futuras
                            convocatorias de formación en Consulta Previa.
                            Nombre, apellidos, correo electrónico y número de
                            telefono celular.
                        </Typography>
                        <FormProvider {...methods}>
                            <Box
                                sx={{
                                    minWidth: { md: "400px", xs: "100%" },
                                    maxWidth: "100%",
                                }}
                            >
                                <Grid container spacing={1.25}>
                                    {WaitListFields?.map((field, index) => {
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
            <DialogActions
                sx={{
                    justifyContent: "space-between",
                    backgroundImage: `url(${getButtonsFooter(curso, small)})`,
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
                        <Stack direction="row" alignItems="center" spacing={0}>
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
                                onClick={methods.handleSubmit(
                                    onSubmit,
                                    onError,
                                )}
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
    );
}

export default ListaEspera;
