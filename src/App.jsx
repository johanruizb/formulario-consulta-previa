import { Fragment, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AlertDialog from "./components/AlertDialogNew";
import { LoadingBackdrop } from "./components/ui";
import { useEnrollmentStatus } from "./hooks/useAPI";
import InscripcionesCerradas from "./pages/Cerrado";
import ListaEspera from "./pages/Espera";
import FormularioDiplomado from "./pages/Form";
import PropTypes from "prop-types";

const ErrorNotFound = lazy(() => import("./pages/Error/404"));

function RoutesForState({ estado }) {
    switch (estado) {
        case "abierto":
            return (
                <Routes>
                    <Route
                        path="404"
                        element={
                            <Suspense fallback={<LoadingBackdrop />}>
                                <ErrorNotFound />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<LoadingBackdrop />}>
                                <FormularioDiplomado />
                            </Suspense>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<LoadingBackdrop />}>
                                <ErrorNotFound />
                            </Suspense>
                        }
                    />
                </Routes>
            );
        case "lista_espera":
            return (
                <Routes>
                    <Route path="*" element={<ListaEspera />} />
                </Routes>
            );
        default:
            return (
                <Routes>
                    <Route path="*" element={<InscripcionesCerradas />} />
                </Routes>
            );
    }
}

RoutesForState.propTypes = {
    estado: PropTypes.string,
};

function App() {
    const { enrollmentState, isLoading } = useEnrollmentStatus();

    console.log(
        "[App] enrollmentState:",
        enrollmentState,
        "isLoading:",
        isLoading,
    );

    if (isLoading) {
        return <LoadingBackdrop />;
    }

    return (
        <Fragment>
            <RoutesForState estado={enrollmentState} />
            <AlertDialog />
        </Fragment>
    );
}

export default App;
