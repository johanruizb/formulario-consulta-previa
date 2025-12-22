import { Component } from "react";
import PropTypes from "prop-types";
import * as Sentry from "@sentry/react";
import {
    Container,
    Paper,
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Chip,
    Stack,
    Snackbar,
    Box,
    IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SystemUpdateAltRoundedIcon from "@mui/icons-material/SystemUpdateAltRounded";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import EnhancedEncryptionRoundedIcon from "@mui/icons-material/EnhancedEncryptionRounded";
import SdStorageRoundedIcon from "@mui/icons-material/SdStorageRounded";
import MonitorHeartRoundedIcon from "@mui/icons-material/MonitorHeartRounded";
import DataObjectRoundedIcon from "@mui/icons-material/DataObjectRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import tinycolor from "tinycolor2";

// Definición de categorías de errores con mensajes personalizados en español
const ERROR_CATEGORIES = {
    CHUNK_LOAD: {
        title: "Error al cargar la página",
        message:
            "Parece que hay una versión nueva de la aplicación. Necesitamos recargar.",
        suggestion: "Presiona 'Recargar página' para continuar",
    },
    NETWORK: {
        title: "Sin conexión a internet",
        message: "No pudimos conectarnos. Verifica tu conexión.",
        suggestion: "Revisa tu WiFi o datos móviles e intenta de nuevo",
    },
    NULL_ACCESS: {
        title: "Datos incompletos",
        message: "Falta información necesaria para mostrar esta sección.",
        suggestion: "Intenta recargar la página o vuelve a la página anterior",
    },
    REFERENCE: {
        title: "Error de configuración",
        message: "Hay un problema con la configuración de la aplicación.",
        suggestion: "Intenta recargar la página",
    },
    AUTH: {
        title: "Sesión expirada",
        message: "Tu sesión ha expirado por inactividad.",
        suggestion: "Recarga la página para iniciar sesión nuevamente",
    },
    SERVER: {
        title: "Problema en el servidor",
        message: "El servidor está experimentando problemas técnicos.",
        suggestion: "Intenta nuevamente en unos minutos",
    },
    TIMEOUT: {
        title: "La operación tardó demasiado",
        message: "El servidor no respondió a tiempo.",
        suggestion: "Verifica tu conexión e intenta de nuevo",
    },
    CORS: {
        title: "Error de permisos",
        message: "No se puede acceder al recurso solicitado.",
        suggestion: "Esto es un problema técnico, intenta recargar",
    },
    QUOTA_EXCEEDED: {
        title: "Almacenamiento lleno",
        message: "El navegador no tiene espacio disponible.",
        suggestion: "Limpia el caché del navegador o libera espacio",
    },
    RENDER_ERROR: {
        title: "Error de visualización",
        message: "La página tiene problemas al mostrarse.",
        suggestion: "Intenta recargar la página",
    },
    JSON_PARSE: {
        title: "Datos incorrectos",
        message: "Recibimos información en formato incorrecto.",
        suggestion: "Intenta recargar la página",
    },
    LAZY_LOAD: {
        title: "Error al cargar componente",
        message: "No se pudo cargar parte de la aplicación.",
        suggestion: "Recarga la página para resolver el problema",
    },
    GENERIC: {
        title: "¡Algo salió mal!",
        message:
            "Ocurrió un error inesperado. No te preocupes, ya lo registramos.",
        suggestion: "Intenta recargar la página",
    },
};

// Función para clasificar el error y obtener mensajes personalizados
function getErrorCategory(error) {
    // Chunk loading errors
    if (
        error?.name === "ChunkLoadError" ||
        error?.message?.includes(
            "Failed to fetch dynamically imported module",
        ) ||
        error?.message?.includes("Loading chunk")
    ) {
        return { category: "CHUNK_LOAD", ...ERROR_CATEGORIES.CHUNK_LOAD };
    }

    // Lazy loading / Suspense errors
    if (
        error?.message?.includes("lazy") ||
        error?.message?.includes("Suspense")
    ) {
        return { category: "LAZY_LOAD", ...ERROR_CATEGORIES.LAZY_LOAD };
    }

    // Network errors
    if (
        error?.name === "NetworkError" ||
        error?.message?.includes("Network request failed") ||
        error?.message?.includes("Failed to fetch") ||
        !navigator.onLine
    ) {
        return { category: "NETWORK", ...ERROR_CATEGORIES.NETWORK };
    }

    // CORS errors
    if (
        error?.message?.includes("CORS") ||
        error?.message?.includes("blocked by CORS policy")
    ) {
        return { category: "CORS", ...ERROR_CATEGORIES.CORS };
    }

    // Timeout errors
    if (error?.name === "TimeoutError" || error?.code === "ECONNABORTED") {
        return { category: "TIMEOUT", ...ERROR_CATEGORIES.TIMEOUT };
    }

    // Auth errors (from API responses)
    if (
        error?.response?.status === 401 ||
        error?.response?.status === 403 ||
        error?.message?.includes("unauthorized") ||
        error?.message?.includes("Unauthorized")
    ) {
        return { category: "AUTH", ...ERROR_CATEGORIES.AUTH };
    }

    // Server errors
    if (error?.response?.status >= 500) {
        return { category: "SERVER", ...ERROR_CATEGORIES.SERVER };
    }

    // JSON parse errors
    if (
        error?.name === "SyntaxError" &&
        (error?.message?.includes("JSON") ||
            error?.message?.includes("Unexpected token"))
    ) {
        return { category: "JSON_PARSE", ...ERROR_CATEGORIES.JSON_PARSE };
    }

    // Quota exceeded (localStorage/sessionStorage)
    if (error?.name === "QuotaExceededError") {
        return {
            category: "QUOTA_EXCEEDED",
            ...ERROR_CATEGORIES.QUOTA_EXCEEDED,
        };
    }

    // React render errors
    if (
        error?.message?.includes("Maximum update depth exceeded") ||
        error?.message?.includes("Too many re-renders")
    ) {
        return { category: "RENDER_ERROR", ...ERROR_CATEGORIES.RENDER_ERROR };
    }

    // Null/undefined access
    if (
        error?.name === "TypeError" &&
        (error?.message?.includes("null") ||
            error?.message?.includes("undefined") ||
            error?.message?.includes("Cannot read propert"))
    ) {
        return { category: "NULL_ACCESS", ...ERROR_CATEGORIES.NULL_ACCESS };
    }

    // Reference errors
    if (error?.name === "ReferenceError") {
        return { category: "REFERENCE", ...ERROR_CATEGORIES.REFERENCE };
    }

    // Generic fallback
    return { category: "GENERIC", ...ERROR_CATEGORIES.GENERIC };
}

const ERROR_ICON_MAP = {
    CHUNK_LOAD: { icon: SystemUpdateAltRoundedIcon, color: "info" },
    NETWORK: { icon: WifiOffRoundedIcon, color: "warning" },
    NULL_ACCESS: { icon: BlockRoundedIcon, color: "warning" },
    REFERENCE: { icon: SettingsSuggestRoundedIcon, color: "secondary" },
    AUTH: { icon: LockResetRoundedIcon, color: "primary" },
    SERVER: { icon: DnsRoundedIcon, color: "error" },
    TIMEOUT: { icon: HourglassEmptyRoundedIcon, color: "warning" },
    CORS: { icon: EnhancedEncryptionRoundedIcon, color: "secondary" },
    QUOTA_EXCEEDED: { icon: SdStorageRoundedIcon, color: "secondary" },
    RENDER_ERROR: { icon: MonitorHeartRoundedIcon, color: "info" },
    JSON_PARSE: { icon: DataObjectRoundedIcon, color: "info" },
    LAZY_LOAD: { icon: HourglassTopRoundedIcon, color: "info" },
    GENERIC: { icon: WarningAmberRoundedIcon, color: "error" },
};

function ErrorCategoryIcon({ category }) {
    const fallback = ERROR_ICON_MAP.GENERIC;
    const iconConfig = ERROR_ICON_MAP[category] || fallback;
    const IconComponent = iconConfig.icon;

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <IconButton
                sx={{
                    p: 1.5,
                    bgcolor: (theme) =>
                        tinycolor(
                            theme.palette[iconConfig.color]?.light ||
                                theme.palette.error.light,
                        )
                            .setAlpha(0.2)
                            .toString() + " !important",
                    border: "1px solid",
                    borderColor: (theme) =>
                        theme.palette[iconConfig.color]?.main ||
                        theme.palette.error.main,
                    boxShadow: (theme) =>
                        `0 8px 24px ${theme.palette.grey[200]}`,
                    width: 72,
                    height: 72,
                }}
                disabled
            >
                <IconComponent
                    fontSize="large"
                    sx={{
                        // fontSize: "large !important",
                        width: "auto !important",
                        height: "auto !important",
                        color: (theme) =>
                            theme.palette[iconConfig.color]?.dark ||
                            theme.palette.error.dark,
                    }}
                />
            </IconButton>
        </Box>
    );
}

ErrorCategoryIcon.propTypes = {
    category: PropTypes.string,
};

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            snackbarOpen: false,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Reportar error a Sentry/GlitchTip
        Sentry.captureException(error, {
            contexts: {
                react: {
                    componentStack: errorInfo.componentStack,
                },
            },
        });

        // Actualizar state con información adicional
        this.setState({
            errorInfo,
        });

        // Log para desarrollo
        if (import.meta.env.DEV) {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }
    }

    buildErrorDetailsJSON = () => {
        const { error, errorInfo } = this.state;
        const errorCategory = getErrorCategory(error);

        const errorDetails = {
            // Información básica del error
            error: {
                name: error?.name || "Unknown",
                message: error?.message || "No message available",
                stack: error?.stack || "No stack trace available",
                category: errorCategory.category,
            },

            // Información de React (componentStack)
            react: {
                componentStack: errorInfo?.componentStack || null,
            },

            // Contexto del navegador
            browser: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                online: navigator.onLine,
                cookiesEnabled: navigator.cookieEnabled,
            },

            // Contexto de la aplicación
            app: {
                url: window.location.href,
                pathname: window.location.pathname,
                timestamp: new Date().toISOString(),
                environment: import.meta.env.MODE,
                version: import.meta.env.VITE_APP_VERSION || "unknown",
            },

            // Información de la pantalla/viewport
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                pixelRatio: window.devicePixelRatio,
            },

            // Información adicional útil
            additional: {
                memoryUsage: performance?.memory?.usedJSHeapSize
                    ? {
                          used: Math.round(
                              performance.memory.usedJSHeapSize / 1048576,
                          ), // MB
                          total: Math.round(
                              performance.memory.totalJSHeapSize / 1048576,
                          ),
                      }
                    : null,
                timing: {
                    domContentLoaded: performance?.timing
                        ?.domContentLoadedEventEnd
                        ? performance.timing.domContentLoadedEventEnd -
                          performance.timing.navigationStart
                        : null,
                },
            },
        };

        return JSON.stringify(errorDetails, null, 2);
    };

    handleCopyDetails = async () => {
        const jsonString = this.buildErrorDetailsJSON();

        try {
            await navigator.clipboard.writeText(jsonString);
            this.setState({ snackbarOpen: true });
        } catch {
            // Fallback para navegadores que no soportan clipboard API
            const textarea = document.createElement("textarea");
            textarea.value = jsonString;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            this.setState({ snackbarOpen: true });
        }
    };

    handleCloseSnackbar = () => {
        this.setState({ snackbarOpen: false });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        const { hasError, error, errorInfo, snackbarOpen } = this.state;
        const { children } = this.props;

        if (hasError) {
            const errorCategory = getErrorCategory(error);

            return (
                <>
                    <Container
                        maxWidth="md"
                        sx={{
                            minHeight: "100vh",
                            display: "flex",
                            alignItems: "center",
                            py: 4,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, sm: 4 },
                                width: "100%",
                                textAlign: "center",
                            }}
                        >
                            {/* Icono basado en la categoría del error */}
                            <ErrorCategoryIcon
                                category={errorCategory.category}
                            />

                            {/* Título dinámico */}
                            <Typography
                                variant="h4"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 600,
                                    color: "error.main",
                                    mb: 2,
                                }}
                            >
                                {errorCategory.title}
                            </Typography>

                            {/* Mensaje amigable */}
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                {errorCategory.message}
                            </Typography>

                            {/* Chip con nombre del error */}
                            {error?.name && (
                                <Chip
                                    label={error.name}
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 2 }}
                                />
                            )}

                            {/* Sugerencia de acción */}
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3, fontStyle: "italic" }}
                            >
                                {errorCategory.suggestion}
                            </Typography>

                            {/* Accordion con detalles técnicos */}
                            <Accordion
                                sx={{
                                    mb: 3,
                                    textAlign: "left",
                                    "&:before": { display: "none" },
                                    border: 1,
                                    borderColor: "divider",
                                }}
                                elevation={0}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="error-details-content"
                                    id="error-details-header"
                                >
                                    <Typography variant="subtitle1">
                                        Detalles técnicos
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* Alerta de advertencia */}
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            Esta información es técnica. No la
                                            compartas públicamente ya que puede
                                            contener datos sensibles.
                                        </Typography>
                                    </Alert>

                                    {/* Mensaje de error */}
                                    <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                        sx={{ fontWeight: 600 }}
                                    >
                                        Mensaje de error:
                                    </Typography>
                                    <Paper
                                        variant="outlined"
                                        sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontFamily: "monospace",
                                                fontSize: "0.75rem",
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {error?.message ||
                                                "No message available"}
                                        </Typography>
                                    </Paper>

                                    {/* Stack trace */}
                                    {error?.stack && (
                                        <>
                                            <Typography
                                                variant="subtitle2"
                                                gutterBottom
                                                sx={{ fontWeight: 600 }}
                                            >
                                                Stack trace:
                                            </Typography>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    mb: 2,
                                                    bgcolor: "grey.50",
                                                    maxHeight: 200,
                                                    overflow: "auto",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: "monospace",
                                                        fontSize: "0.7rem",
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {error.stack}
                                                </Typography>
                                            </Paper>
                                        </>
                                    )}

                                    {/* Component stack */}
                                    {errorInfo?.componentStack && (
                                        <>
                                            <Typography
                                                variant="subtitle2"
                                                gutterBottom
                                                sx={{ fontWeight: 600 }}
                                            >
                                                Component stack:
                                            </Typography>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 2,
                                                    bgcolor: "grey.50",
                                                    maxHeight: 200,
                                                    overflow: "auto",
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: "monospace",
                                                        fontSize: "0.7rem",
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {errorInfo.componentStack}
                                                </Typography>
                                            </Paper>
                                        </>
                                    )}
                                </AccordionDetails>
                            </Accordion>

                            {/* Botones de acción */}
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                            >
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={this.handleReload}
                                    size="large"
                                >
                                    Recargar página
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={this.handleCopyDetails}
                                    size="large"
                                >
                                    Copiar detalles
                                </Button>
                            </Stack>
                        </Paper>
                    </Container>

                    {/* Snackbar de confirmación */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={this.handleCloseSnackbar}
                        message="Detalles copiados al portapapeles"
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                    />
                </>
            );
        }

        return children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
