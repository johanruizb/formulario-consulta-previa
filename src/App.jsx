import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";

import AlertDialog from "./components/AlertDialog";
import ErrorNotFound from "./pages/Error/404";
import FullScreenDialog from "./pages/Form";
import Home from "./pages/Home";

function App() {
    return (
        <Fragment>
            <Routes>
                <Route path=":curso" element={<FullScreenDialog />} />
                <Route path="404" element={<ErrorNotFound />} />
                <Route path="/" element={<Home />} />
            </Routes>
            <AlertDialog />
        </Fragment>
    );
}

export default App;
