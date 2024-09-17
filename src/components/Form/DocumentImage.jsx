import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRenderCount } from "@uidotdev/usehooks";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";
import Reverso from "../../assets/reverso.png";
import Frente from "../../assets/frente.png";

const DocumentField = forwardRef(function DocumentField(props, ref) {
    const low = false;
    const [url, setUrl] = useState();
    const { getInputProps, placeholder } = props;

    useEffect(() => {
        if (low && props.image) {
            setUrl(props.image.name);
        } else if (props.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result);
            };
            reader.readAsDataURL(props.image);
        }

        return () => {
            // cleanup URL object
            if (url) URL.revokeObjectURL(url);
        };
    }, [low, props.image, url]);

    useEffect(() => {
        URL.revokeObjectURL(url);
    }, [url]);

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

function FrontDocumentImage() {
    const counter = useRenderCount();
    const { control } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: "frontDocument",
        control,
        rules: {
            required: {
                value: true,
                message: "Este campo no puede estar vacio",
            },
        },
    });

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        accept: {
            "image/png": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
        onDropAccepted: (files) => {
            field.onChange(files[0]);
        },
    });

    const { ref, ...rootProps } = getRootProps();

    console.log("FrontDocumentImage » counter", counter);

    return (
        <TextField
            {...rootProps}
            value={acceptedFiles[0]?.name ?? ""}
            label="Frente del documento"
            error={Boolean(error?.type || error?.types)}
            helperText={error?.message ?? " "}
            ref={ref}
            fullWidth
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                inputComponent: DocumentField,
                inputProps: {
                    getInputProps,
                    image: acceptedFiles[0],
                    placeholder: Frente,
                },
            }}
            sx={{
                "*": {
                    cursor: "pointer !important",
                },
                ".MuiFormControl-root": {
                    borderStyle: "dashed !important",
                },
                // mb: "19.91px",
            }}
        />
    );
}

function BackDocumentImage() {
    const { control } = useFormContext();

    const {
        field,
        fieldState: { error },
    } = useController({
        name: "backDocument",
        control,
        rules: {
            required: {
                value: true,
                message: "Este campo no puede estar vacio",
            },
        },
    });

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
        accept: {
            "image/png": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
        onDropAccepted: (files) => {
            field.onChange(files[0]);
        },
    });

    const { ref, ...rootProps } = getRootProps();

    return (
        <TextField
            {...rootProps}
            value={acceptedFiles[0]?.name ?? ""}
            label="Reverso del documento"
            error={Boolean(error?.type || error?.types)}
            helperText={error?.message ?? " "}
            ref={ref}
            fullWidth
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                inputComponent: DocumentField,
                inputProps: {
                    getInputProps,
                    image: acceptedFiles[0],
                    placeholder: Reverso,
                },
            }}
            sx={{
                "*": {
                    cursor: "pointer !important",
                },
                ".MuiFormControl-root": {
                    borderStyle: "dashed !important",
                },
                // mb: "19.91px",
            }}
        />
    );
}

function DocumentImage() {
    return (
        <Grid container spacing={1.25}>
            <Grid item xs={12} md={6}>
                <FrontDocumentImage />
            </Grid>
            <Grid item xs={12} md={6}>
                <BackDocumentImage />
            </Grid>
        </Grid>
    );
}

export default DocumentImage;
