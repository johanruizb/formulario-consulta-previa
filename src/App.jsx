import { Fragment, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AlertDialog from "./components/AlertDialogNew";
import { LoadingBackdrop } from "./components/ui";
import { useEnrollmentStatus } from "./hooks/useAPI";
import ListaEspera from "./pages/Espera";

import "./App.css";
import FormularioDiplomado from "./pages/Form";

const ErrorNotFound = lazy(() => import("./pages/Error/404"));
const ErrorBoundaryTest = lazy(() => import("./components/ErrorBoundaryTest"));

function App() {
    const { isActive, isLoading } = useEnrollmentStatus();

    if (isLoading) {
        return <LoadingBackdrop />;
    }

    return (
        <Fragment>
            {isActive ? (
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
                    {/* <Route
                        path="/test-error-boundary"
                        element={
                            <Suspense fallback={<LoadingBackdrop />}>
                                <ErrorBoundaryTest />
                            </Suspense>
                        }
                    /> */}
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<LoadingBackdrop />}>
                                <ErrorNotFound />
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
