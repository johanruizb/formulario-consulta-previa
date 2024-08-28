import { ThemeProvider } from "@emotion/react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import customTheme, { extendedTheme } from "./theme/index.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider theme={customTheme}>
            <CssVarsProvider theme={extendedTheme}>
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="es"
                >
                    <App />
                </LocalizationProvider>
            </CssVarsProvider>
        </ThemeProvider>
    </StrictMode>,
);
