import BorderColorIcon from "@mui/icons-material/BorderColor";
import ShareIcon from "@mui/icons-material/Share";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom/dist";
import useSmall from "../../hooks/breakpoint/useSmall";
import { getBanner } from "../../pages/Form/functions";

import { Fragment } from "react";
import useSWR from "swr";
import fetcher from "../../hooks/request/config";
import { formatNumber } from "../../utils/number";
import { URI } from "../constant";

import PropTypes from "prop-types";

export default function CourseCard({ slotProps, children }) {
    const { uri = "/inscripcion/cupos/20hr" } = slotProps?.fetcher ?? {};
    const { data, error, isLoading, isValidating } = useSWR(
        URI.API + uri,
        fetcher,
    );

    const small = useSmall();

    return (
        <Card
            elevation={3}
            {...slotProps.card}
            sx={{
                display: "flex",
                flexDirection: "column",
                border: 1,
                borderRadius: 1.25,
                borderColor: "#0A64BD",
                height: "100%",
                ...(slotProps.card?.sx ?? {}),
            }}
        >
            <CardHeader
                avatar={<Avatar sx={{ bgcolor: "#0A64BD" }}>1</Avatar>}
                title="Autoformación en Consulta Previa"
                subheader="Septiembre 31, 2024"
                {...slotProps.cardHeader}
            />
            <CardMedia
                component="img"
                height="250"
                image={getBanner("20hr", small)}
                alt="Banner de consulta previa con informacion del curso"
                {...slotProps.cardMedia}
            />
            <CardContent
                sx={{
                    flex: "1 0 auto",
                }}
            >
                {children}
            </CardContent>
            <CardActions
                sx={{
                    justifyContent: "center",
                }}
            >
                {isLoading ? (
                    <CircularProgress size={18} />
                ) : error ? (
                    <Typography
                        color="error"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        Error al cargar los cupos
                    </Typography>
                ) : data?.curso_disponible ? (
                    <Fragment>
                        <Button
                            aria-label="Inscribirse al curso de 20 horas"
                            startIcon={<BorderColorIcon />}
                            color="primary"
                            LinkComponent={Link}
                            to="20hr"
                            {...slotProps.button}
                        >
                            Inscribirse
                        </Button>
                        <IconButton
                            aria-label="Compartir"
                            {...slotProps.shareButton}
                        >
                            <ShareIcon />
                        </IconButton>
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1.25}
                            sx={{
                                flex: 1,
                            }}
                        >
                            {isValidating && <CircularProgress size={18} />}
                            <Typography
                                color={
                                    data?.curso_disponible ? "success" : "error"
                                }
                                sx={{
                                    textAlign: "right",
                                }}
                            >
                                {formatNumber(data?.cupos ?? 0)} cupos
                                disponibles
                            </Typography>
                        </Stack>
                    </Fragment>
                ) : (
                    <Typography
                        color="error"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        No hay cupos disponibles
                    </Typography>
                )}
            </CardActions>
        </Card>
    );
}

CourseCard.propTypes = {
    slotProps: PropTypes.shape({
        fetcher: PropTypes.shape({
            uri: PropTypes.string,
        }),
        card: PropTypes.shape({
            sx: PropTypes.object,
        }),
        cardHeader: PropTypes.object,
        cardMedia: PropTypes.object,
        button: PropTypes.object,
        shareButton: PropTypes.object,
    }),
    children: PropTypes.node,
};
