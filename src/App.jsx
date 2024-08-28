import { Fragment } from "react";
import "./App.css";
import FullScreenDialog from "./pages/Form";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
    return (
        <Fragment>
            <FullScreenDialog />
            <SpeedInsights />
        </Fragment>
    );
}

export default App;
