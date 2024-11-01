import { Fragment, useCallback, useEffect, useState } from "react";
import USUARIO from "../hooks/request/usuario";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

import PropTypes from "prop-types";

export default function Loging({ error, visible = false }) {
    const [registro, setRegistro] = useState({ sending: true });

    const handleSubmit = useCallback(() => {
        setRegistro({ sending: true });
        USUARIO.registrarLog(error, "error")
            .then((res) => {
                if (res.ok) {
                    res.json().then((log) => {
                        setRegistro({ id: log.id });
                        console.log("Log registrado", log);
                    });
                } else {
                    setRegistro({ error: true });
                    console.error("Error al registrar el log");
                }
            })
            .catch((err) => {
                setRegistro({ error: true });
                console.error("Error al registrar el log", err);
            })
            .finally(() => {
                setRegistro((prev) => ({ ...prev, sending: false }));
            });
    }, [error]);

    useEffect(() => {
        if (error) handleSubmit();
        return () => setRegistro({ sending: true });
    }, [error, handleSubmit]);

    return visible && registro.sending ? (
        <CircularProgress />
    ) : (
        <Chip
            label={
                <Fragment>
                    {error.statusText
                        ? String(error.statusText)
                              .toUpperCase()
                              .replaceAll(" ", "_") + ": "
                        : ""}
                    ID_{registro.id ?? "-1"}
                </Fragment>
            }
            sx={{
                position: "fixed",
                bottom: 0,
                mb: 2,
            }}
        />
    );
}

Loging.propTypes = {
    error: PropTypes.any,
    visible: PropTypes.bool,
};
