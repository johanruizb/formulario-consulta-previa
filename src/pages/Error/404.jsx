import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function PageError({
    code = 404,
    message = "La página que intentas acceder no existe",
}) {
    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Error <strong>{code}</strong>
            </Typography>
            <Typography
                variant="h5"
                textAlign={"center"}
                sx={{
                    mx: 2,
                }}
            >
                {message}
            </Typography>
            <Button
                variant="contained"
                LinkComponent={Link}
                to="/"
                sx={{
                    mt: 3,
                }}
            >
                Volver al inicio
            </Button>
        </Paper>
    );
}

PageError.propTypes = {
    code: PropTypes.number,
    message: PropTypes.string,
};

export default PageError;
