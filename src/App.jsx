import { SpeedInsights } from "@vercel/speed-insights/react";
import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import FullScreenDialog from "./pages/Form";
import Home from "./pages/Home";

function App() {
    return (
        <Fragment>
            <Routes>
                <Route path=":curso" element={<FullScreenDialog />} />
                <Route path="/" element={<Home />} />
            </Routes>
            <SpeedInsights />
        </Fragment>
    );
}

export default App;
