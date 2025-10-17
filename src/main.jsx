import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
    THEME_ID as MATERIAL_THEME_ID,
    ThemeProvider,
} from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Profiler, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";
import App from "./App.jsx";
import customTheme from "./theme/index.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";

const router = createBrowserRouter([
    {
        path: "/*",
        element: <App />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Profiler id="app">
            <ThemeProvider theme={{ [MATERIAL_THEME_ID]: customTheme }}>
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="es"
                >
                    <JoyCssVarsProvider>
                        <SWRConfig
                            value={{
                                revalidateOnMount: true,
                                refreshInterval: false,
                                fetcher: async (...args) =>
                                    fetch(...args).then((res) =>
                                        res.ok
                                            ? res.json()
                                            : Promise.reject({
                                                  status: res.status,
                                                  statusText: res.statusText,
                                              }),
                                    ),
                            }}
                        >
                            <AlertProvider>
                                <RouterProvider router={router} />
                            </AlertProvider>
                        </SWRConfig>
                    </JoyCssVarsProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </Profiler>
    </StrictMode>,
);
