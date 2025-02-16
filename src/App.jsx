import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Fragment, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import useSWR from "swr";
import AlertDialog from "./components/AlertDialog";
import { URI } from "./components/constant";
import fetcher from "./hooks/request/config";
import ListaEspera from "./pages/Espera";

import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const FormularioRegistro = lazy(() => import("./pages/Form"));
const ErrorNotFound = lazy(() => import("./pages/Error/404"));

function App() {
    const { data: estado, isLoading } = useSWR(
        URI.API + "/inscripcion/estado",
        fetcher,
    );

    return isLoading ? (
        <Backdrop
            open={true}
            sx={{
                bgcolor: "transparent",
            }}
        >
            <CircularProgress />
        </Backdrop>
    ) : (
        <Fragment>
            {estado?.activo ? (
                <Routes>
                    <Route
                        path=":curso"
                        element={
                            <Suspense
                                fallback={
                                    <Backdrop
                                        open={true}
                                        sx={{
                                            bgcolor: "transparent",
                                        }}
                                    >
                                        <CircularProgress />
                                    </Backdrop>
                                }
                            >
                                <FormularioRegistro />
                            </Suspense>
                        }
                    />
                    <Route
                        path="404"
                        element={
                            <Suspense
                                fallback={
                                    <Backdrop
                                        open={true}
                                        sx={{
                                            bgcolor: "transparent",
                                        }}
                                    >
                                        <CircularProgress />
                                    </Backdrop>
                                }
                            >
                                <ErrorNotFound />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <Suspense
                                fallback={
                                    <Backdrop
                                        open={true}
                                        sx={{
                                            bgcolor: "transparent",
                                        }}
                                    >
                                        <CircularProgress />
                                    </Backdrop>
                                }
                            >
                                <Home />
                            </Suspense>
                        }
                    />
                </Routes>
            ) : (
                <Routes>
                    <Route path="*" element={<ListaEspera />} />
                </Routes>
            )}
            <AlertDialog />
        </Fragment>
    );
}

export default App;
