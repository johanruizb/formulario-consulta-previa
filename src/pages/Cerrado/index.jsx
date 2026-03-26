import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { getBanner, getFooter } from "../../config/courseAssets";
import useSmall from "../../hooks/breakpoint/useSmall";

export default function InscripcionesCerradas() {
    const { curso = "diplomado" } = useParams();
    const small = useSmall();

    const Banner = getBanner(curso, small);
    const Footer = getFooter(curso, small);

    return (
        <Dialog fullScreen open>
            <DialogContent
                sx={{
                    p: "0px !important",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Box
                    component="img"
                    src={Banner}
                    alt="Banner"
                    sx={{
                        width: "100%",
                    }}
                />

                <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        flex: 1,
                        px: { xs: 3, md: 6 },
                        py: { xs: 5, md: 7 },
                        animation: "fadeInUp 0.6s ease-out both",
                        "@keyframes fadeInUp": {
                            "0%": {
                                opacity: 0,
                                transform: "translateY(16px)",
                            },
                            "100%": {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                        },
                    }}
                >
                    <EventBusyOutlinedIcon
                        sx={{
                            fontSize: { xs: 56, md: 72 },
                            color: "text.secondary",
                            mb: 2.5,
                        }}
                    />

                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        sx={{
                            fontWeight: 600,
                            mb: 2,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Inscripciones cerradas
                    </Typography>

                    <Divider
                        sx={{
                            width: 48,
                            borderBottomWidth: 3,
                            borderColor: "primary.main",
                            mb: 3,
                        }}
                    />

                    <Typography
                        variant="body1"
                        align="center"
                        sx={{
                            maxWidth: 560,
                            color: "text.secondary",
                            lineHeight: 1.75,
                        }}
                    >
                        El periodo de inscripciones para el proceso de formación
                        en Consulta Previa se encuentra cerrado en este momento.
                        Agradecemos su interés. Le invitamos a estar atento a
                        nuestros canales oficiales para conocer futuras
                        convocatorias.
                    </Typography>
                </Stack>

                <Box
                    component="img"
                    src={Footer}
                    alt="Footer"
                    sx={{
                        width: "100%",
                        mt: "auto",
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}
