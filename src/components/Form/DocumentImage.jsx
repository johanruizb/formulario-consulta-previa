import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import imageCompression from "browser-image-compression";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useController, useFormContext } from "react-hook-form";

import Frente from "../../assets/frente.png";
import Reverso from "../../assets/reverso.png";

// Configuración de compresión optimizada para documentos
const COMPRESSION_OPTIONS = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    initialQuality: 0.9,
    useWebWorker: true,
};

const MIN_FILE_SIZE_KB = 50;

/**
 * Comprime una imagen manteniendo la legibilidad del texto
 * @param {File} file - Archivo de imagen a comprimir
 * @param {Function} onProgressUpdate - Callback para actualizar progreso (0-100)
 * @returns {Promise<{compressedFile: File, isUnderCompressed: boolean}>}
 */
async function compressImage(file, onProgressUpdate) {
    try {
        console.log(
            `[Compresión] Tamaño original: ${(file.size / 1024 / 1024).toFixed(
                2,
            )} MB`,
        );

        // Preservar metadatos del archivo original
        const originalName = file.name;
        const originalType = file.type;

        const compressedBlob = await imageCompression(file, {
            ...COMPRESSION_OPTIONS,
            onProgress: onProgressUpdate,
        });

        // Recrear el File con el nombre y tipo originales
        // Esto es crucial para que Django pueda validar la extensión correctamente
        const compressedFile = new File([compressedBlob], originalName, {
            type: originalType,
            lastModified: Date.now(),
        });

        const compressedSizeMB = compressedFile.size / 1024 / 1024;
        const compressedSizeKB = compressedFile.size / 1024;

        console.log(
            `[Compresión] Tamaño comprimido: ${compressedSizeMB.toFixed(
                2,
            )} MB (${compressedSizeKB.toFixed(2)} KB)`,
        );
        console.log(
            `[Compresión] Reducción: ${(
                (1 - compressedFile.size / file.size) *
                100
            ).toFixed(1)}%`,
        );

        const isUnderCompressed = compressedSizeKB < MIN_FILE_SIZE_KB;

        if (isUnderCompressed) {
            console.warn(
                `[Compresión] ⚠️ Archivo muy pequeño (${compressedSizeKB.toFixed(
                    2,
                )} KB). Podría estar sobre-comprimido.`,
            );
        }

        return { compressedFile, isUnderCompressed };
    } catch (error) {
        console.error("[Compresión] Error al comprimir imagen:");
        console.error(error.stack);
        // Si falla la compresión, retornar archivo original
        return { compressedFile: file, isUnderCompressed: false };
    }
}

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
    const [url, setUrl] = useState();
    const { getInputProps, placeholder, image, isCompressing, progress } =
        props;

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result);
            };
            reader.readAsDataURL(image);
        }
    }, [image]);

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
                    <Box
                        sx={{
                            position: "relative",
                            mt: "6px",
                            width: "calc(100% - 1px)",
                            height: "calc(100% - 6px - 1px)",
                            backgroundImage: `url(${url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                        }}
                    >
                        {isCompressing && (
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                    size={60}
                                    sx={{ color: "white" }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: "white", fontWeight: "bold" }}
                                >
                                    Comprimiendo... {progress}%
                                </Typography>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box>
                        <img
                            // fetchPriority="high"
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
                            Peso máximo de 10MB
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
    isCompressing: PropTypes.bool,
    progress: PropTypes.number,
};

function FrontDocumentImage({ formRef }) {
    const { control, setError, clearErrors } = useFormContext();
    const [compressionProgress, setCompressionProgress] = useState(null);
    const [compressionWarning, setCompressionWarning] = useState(null);

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
            // "image/*": [],
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024,
        onDropAccepted: async (files) => {
            setCompressionProgress(0);
            setCompressionWarning(null);
            clearErrors("frontDocument");

            const { compressedFile, isUnderCompressed } = await compressImage(
                files[0],
                setCompressionProgress,
            );

            if (isUnderCompressed) {
                setCompressionWarning(
                    `⚠️ La imagen comprimida es muy pequeña (${(
                        compressedFile.size / 1024
                    ).toFixed(0)} KB). Verifica que el texto sea legible.`,
                );
            }

            field.onChange(compressedFile);
            setCompressionProgress(null);
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
            helperText={error?.message ?? compressionWarning ?? " "}
            ref={ref}
            fullWidth
            sx={{
                "*": {
                    cursor: "pointer !important",
                },
                ".MuiFormControl-root": {
                    borderStyle: "dashed !important",
                },
                ...(compressionWarning && {
                    "& .MuiFormHelperText-root": {
                        color: "warning.main",
                    },
                }),
            }}
            slotProps={{
                input: {
                    inputComponent: DocumentField,
                    inputProps: {
                        getInputProps,
                        image: acceptedFiles[0],
                        placeholder: Frente,
                        isCompressing: compressionProgress !== null,
                        progress: compressionProgress ?? 0,
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
    const [compressionProgress, setCompressionProgress] = useState(null);
    const [compressionWarning, setCompressionWarning] = useState(null);

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
        onDropAccepted: async (files) => {
            setCompressionProgress(0);
            setCompressionWarning(null);
            clearErrors("backDocument");

            const { compressedFile, isUnderCompressed } = await compressImage(
                files[0],
                setCompressionProgress,
            );

            if (isUnderCompressed) {
                setCompressionWarning(
                    `⚠️ La imagen comprimida es muy pequeña (${(
                        compressedFile.size / 1024
                    ).toFixed(0)} KB). Verifica que el texto sea legible.`,
                );
            }

            field.onChange(compressedFile);
            setCompressionProgress(null);
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
            helperText={error?.message ?? compressionWarning ?? " "}
            ref={ref}
            fullWidth
            sx={{
                "*": {
                    cursor: "pointer !important",
                },
                ".MuiFormControl-root": {
                    borderStyle: "dashed !important",
                },
                ...(compressionWarning && {
                    "& .MuiFormHelperText-root": {
                        color: "warning.main",
                    },
                }),
            }}
            slotProps={{
                input: {
                    inputComponent: DocumentField,
                    inputProps: {
                        getInputProps,
                        image: acceptedFiles[0],
                        placeholder: Reverso,
                        isCompressing: compressionProgress !== null,
                        progress: compressionProgress ?? 0,
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
