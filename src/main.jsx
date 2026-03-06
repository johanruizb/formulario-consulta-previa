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
import React, { Profiler, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    createRoutesFromChildren,
    matchRoutes,
    RouterProvider,
    useLocation,
    useNavigationType,
} from "react-router-dom";
import { SWRConfig } from "swr";
import App from "./App.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import customTheme from "./theme/index.jsx";
import * as Sentry from "@sentry/react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

Sentry.init({
    dsn: "https://3cc4aae5c0944bda8fa9c4f7e613e0c4@glitchtip-o00w44cssko8s8sgos84os0k.johanruizb.xyz/3",
    environment: import.meta.env.PROD ? "production" : "development",
    tracesSampleRate: 1,
    integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect: React.useEffect,
            useLocation: useLocation,
            useNavigationType: useNavigationType,
            createRoutesFromChildren: createRoutesFromChildren,
            matchRoutes: matchRoutes,
        }),
    ],
});

const router = createBrowserRouter([
    {
        path: "/*",
        element: (
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        ),
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
