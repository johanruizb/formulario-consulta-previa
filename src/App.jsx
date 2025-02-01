import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import AlertDialog from "./components/AlertDialog";
// import ErrorNotFound from "./pages/Error/404";
// import FormularioRegistro from "./pages/Form";
// import Home from "./pages/Home";

import "./App.css";
import ListaEspera from "./pages/Espera";
// const Home = lazy(() => import("./pages/Home"));
// const FormularioRegistro = lazy(() => import("./pages/Form"));
// const ErrorNotFound = lazy(() => import("./pages/Error/404"));

function App() {
    return (
        <Fragment>
            <Routes>
                <Route path="*" element={<ListaEspera />} />
                {/* <Route
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
                /> */}
            </Routes>
            <AlertDialog />
        </Fragment>
    );
}

export default App;
