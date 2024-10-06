// import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";

import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CourseCard from "../../components/Home/CourseCard";
import useSmall from "../../hooks/breakpoint/useSmall";
import { getBanner } from "../Form/functions";

export default function Home() {
    const small = useSmall();

    const onShare = (url) => {
        if (navigator.share) {
            navigator
                .share({
                    title: "Curso virtual de autoformación en Consulta Previa",
                    text: "Aprende sobre consulta previa en este curso virtual",
                    url: url,
                })
                .then(() => console.log("Successful share"))
                .catch((error) => console.log("Error sharing", error));
        } else {
            console.log("Web Share API not supported");
        }
    };

    return (
        // <Box>
        <Paper
            // sx={{
            //     p: 1.25,
            // }}
            elevation={0}
        >
            <DialogTitle>Cursos disponibles</DialogTitle>
            <DialogContent>
                <Grid
                    container
                    spacing={1.25}
                    sx={{
                        justifyContent: "center",
                    }}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <CourseCard
                            slotProps={{
                                fetcher: {
                                    uri: "/inscripcion/cupos/20hr",
                                },
                                cardHeader: {
                                    title: "Curso virtual de autoformación en Consulta Previa",
                                    subheader: "Septiembre 31, 2024",
                                },
                                cardMedia: {
                                    image: getBanner("20hr", small),
                                    alt: "Banner de consulta previa del curso de 20 horas, dirigido a ciudadanos en general.",
                                },
                                button: {
                                    to: "20hr",
                                },
                                shareButton: {
                                    onClick: () =>
                                        onShare(
                                            "https://registro.consultaprevia.co/20hr",
                                        ),
                                },
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Nombre del curso:</strong> Curso virtual
                                de autoformación en Consulta Previa
                                <br />
                                <strong>Objetivo:</strong> Promover en los
                                participantes la compresión y promoción de la
                                Consulta Previa como Derecho Fundamental para la
                                protección y defensa de los grupos Étnicos.
                                <br />
                                <strong>Dirigido a:</strong> Miembros de grupos
                                étnicos, ejecutores, institucionalidad
                                interviniente y ciudadanos en general.
                                <br />
                                <strong>Duración:</strong> 20 horas
                                <br />
                                <strong>Modalidad:</strong> 100% Virtual –
                                Autogestionado
                                <br />
                                <strong>Contenidos:</strong>
                                <br />
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 2 }}>
                                ● Qué es la consulta previa y sus alcances
                                <br />● Principios orientadores de la Consulta
                                Previa y Actores
                                <br />
                                ● Principales instrumentos jurídicos de la
                                Consulta Previa
                                <br />● Etapas de la Consulta Previa
                            </Typography>
                        </CourseCard>
                    </Grid>
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >
                        <CourseCard
                            slotProps={{
                                fetcher: {
                                    uri: "/inscripcion/cupos/20hr-institucional",
                                },
                                card: {
                                    elevation: 3,
                                    sx: {
                                        borderColor: "#FF9F00",
                                    },
                                },
                                cardHeader: {
                                    title: "Curso virtual de autoformación en consulta previa para fortalecimiento de capacidades institucionales",
                                    subheader: "Septiembre 31, 2024",
                                    avatar: (
                                        <Avatar sx={{ bgcolor: "#FF9F00" }}>
                                            2
                                        </Avatar>
                                    ),
                                },
                                cardMedia: {
                                    image: getBanner(
                                        "20hr-institucional",
                                        small,
                                    ),
                                    alt: "Banner de consulta previa del curso de 20 horas, dirigido a funcionarios públicos.",
                                },
                                button: {
                                    to: "20hr-institucional",
                                },
                                shareButton: {
                                    onClick: () =>
                                        onShare(
                                            "https://registro.consultaprevia.co/20hr-institucional",
                                        ),
                                },
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Nombre del curso:</strong> Curso virtual
                                de autoformación en consulta previa para
                                fortalecimiento de capacidades institucionales
                                <br />
                                <strong>Objetivo:</strong> Fortalecer
                                conocimientos y desarrollar habilidades para el
                                acompañamiento a los procesos y procedimientos
                                de la Consulta Previa.
                                <br />
                                <strong>Dirigido a:</strong> Contratista y
                                funcionarios del Ministerio del Interior
                                <br />
                                <strong>Duración:</strong> 20 horas
                                <br />
                                <strong>Modalidad:</strong> 100% Virtual –
                                Autogestionado
                                <br />
                                <strong>Contenidos:</strong>
                                <br />
                            </Typography>
                            <Typography variant="body2" sx={{ ml: 2 }}>
                                ● Qué es la Consulta Previa y sus antecedentes.
                                <br />
                                ● Procedimiento para la implementación de la
                                Consulta Previa en Colombia.
                                <br />
                                ● Buenas y Malas Prácticas en el proceso de
                                Consulta Previa
                                <br />● Técnicas de negociación en el proceso de
                                Consulta Previa.
                            </Typography>
                        </CourseCard>
                    </Grid>
                </Grid>
            </DialogContent>
        </Paper>
        // </Box>
    );
}
