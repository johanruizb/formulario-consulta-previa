import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";

import Frente from "../../assets/frente.png";
import Reverso from "../../assets/reverso.png";

function getErrorMessage(errorCode) {
    switch (errorCode) {
        case "file-invalid-type":
            return "El archivo tiene un tipo no permitido.";
        case "file-too-large":
            return "El archivo es demasiado grande.";
        case "file-too-small":
            return "El archivo es demasiado pequeño.";
        case "too-many-files":
            return "Has seleccionado demasiados archivos.";
        default:
            return "Ha ocurrido un error desconocido.";
    }
}

const DocumentField = forwardRef(function DocumentField(props, ref) {
    const low = false;
    const [url, setUrl] = useState();
    const { getInputProps, placeholder, image } = props;

    useEffect(() => {
        if (low && image) {
            setUrl(image.name);
        } else if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result);
            };
            reader.readAsDataURL(image);
        }

        return () => {
            // cleanup URL object
            if (url) URL.revokeObjectURL(url);
        };
    }, [low, image, url]);

    return (
        <Paper
            ref={ref}
            elevation={0}
            sx={{
                width: "100%",
                height: "100%",
            }}
        >
            <input {...getInputProps()} />
            <AspectRatio variant="plain">
                {url ? (
                    low ? (
                        <Typography textAlign="center" variant="body2">
                            {url}
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                // border: 1,
                                // borderColor: "rgba(0, 0, 0, 0.25)",
                                mt: "6px",
                                width: "calc(100% - 1px)",
                                height: "calc(100% - 6px - 1px)",
                                backgroundImage: `url(${url})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                display: "flex",
                            }}
                        />
                    )
                ) : (
                    <Box>
                        <img
                            src={placeholder}
                            alt="Imagen"
                            width="100%"
                            height="100%"
                        />
                        <Typography
                            textAlign="center"
                            variant="body2"
                            sx={{
                                position: "absolute",
                                right: "50%",
                                top: "50%",
                                transform: "translate(50%, -50%)",
                                bgcolor: "white",
                                p: "5px",
                            }}
                        >
                            Se aceptan archivos .png, .jpg, .jpeg
                            <br />
                            Peso maximo de 10MB
                        </Typography>
                    </Box>
                )}
            </AspectRatio>
        </Paper>
    );
});

DocumentField.propTypes = {
    getInputProps: PropTypes.func,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    image: PropTypes.object,
    placeholder: PropTypes.string,
};

function FrontDocumentImage({ formRef }) {
    const { control, setError, clearErrors } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: "frontDocument",
        control,
        rules: {
            required: {
                value: true,
                message: "Es necesario subir una foto del frente del documento",
            },
        },
    });

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        accept: {
            "image/png": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024,
        onDropAccepted: (files) => {
            field.onChange(files[0]);
            clearErrors("frontDocument");
        },
        onDropRejected: (files) => {
            setError("frontDocument", {
                type: "manual",
                message: getErrorMessage(files[0].errors[0].code),
            });
        },
    });

    const { ref, ...rootProps } = getRootProps();

    return (
        <TextField
            {...rootProps}
            inputRef={(el) => (formRef.current.frontDocument = el)}
            value={acceptedFiles[0]?.name ?? ""}
            label="Frente del documento"
            error={Boolean(error?.type || error?.types)}
            helperText={error?.message ?? " "}
            ref={ref}
            fullWidth
            sx={{
                "*": {
                    cursor: "pointer !important",
                },
                ".MuiFormControl-root": {
                    borderStyle: "dashed !important",
                },
                // mb: "19.91px",
            }}
            slotProps={{
                input: {
                    inputComponent: DocumentField,
                    inputProps: {
                        getInputProps,
                        image: acceptedFiles[0],
                        placeholder: Frente,
                    },
                },

                inputLabel: {
                    shrink: true,
                },
            }}
        />
    );
}

FrontDocumentImage.propTypes = {
    formRef: PropTypes.any,
};

function BackDocumentImage({ formRef }) {
    const { control, setError, clearErrors } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: "backDocument",
        control,
        rules: {
            required: {
                value: true,
                message:
                    "Es necesario subir una foto del reverso del documento",
            },
        },
    });

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        accept: {
            "image/png": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024,
        onDropAccepted: (files) => {
            field.onChange(files[0]);
            clearErrors("backDocument");
        },
        onDropRejected: (files) => {
            setError("backDocument", {
                type: "manual",
                message: getErrorMessage(files[0].errors[0].code),
            });
        },
    });

    const { ref, ...rootProps } = getRootProps();

    return (
        <TextField
            {...rootProps}
            inputRef={(el) => (formRef.current.backDocument = el)}
            value={acceptedFiles[0]?.name ?? ""}
            label="Reverso del documento"
            error={Boolean(error?.type || error?.types)}
            helperText={error?.message ?? " "}
            ref={ref}
            fullWidth
            sx={{
                "*": {
                    cursor: "pointer !important",
                },
                ".MuiFormControl-root": {
                    borderStyle: "dashed !important",
                },
                // mb: "19.91px",
            }}
            slotProps={{
                input: {
                    inputComponent: DocumentField,
                    inputProps: {
                        getInputProps,
                        image: acceptedFiles[0],
                        placeholder: Reverso,
                    },
                },

                inputLabel: {
                    shrink: true,
                },
            }}
        />
    );
}

BackDocumentImage.propTypes = {
    formRef: PropTypes.any,
};

function DocumentImage({ slotProps }) {
    const { formRef } = slotProps;

    return (
        <Grid container spacing={1.25}>
            <Grid
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <FrontDocumentImage formRef={formRef} />
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    md: 6,
                }}
            >
                <BackDocumentImage formRef={formRef} />
            </Grid>
        </Grid>
    );
}

DocumentImage.propTypes = {
    slotProps: PropTypes.shape({
        formRef: PropTypes.any,
    }),
};

export default DocumentImage;
