import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
    THEME_ID as MATERIAL_THEME_ID,
    ThemeProvider,
} from "@mui/material/styles";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import customTheme from "./theme/index.jsx";
import { SWRConfig } from "swr";

const router = createBrowserRouter([
    {
        path: "/*",
        element: <App />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider theme={{ [MATERIAL_THEME_ID]: customTheme }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
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
                        <RouterProvider router={router} />
                    </SWRConfig>
                </JoyCssVarsProvider>
            </LocalizationProvider>
        </ThemeProvider>
    </StrictMode>,
);
