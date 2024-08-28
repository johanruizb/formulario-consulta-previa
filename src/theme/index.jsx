import {
    createTheme,
    experimental_extendTheme as extendTheme,
} from "@mui/material/styles";

import { esES as coreEsES } from "@mui/material/locale";
import { esES as pickersEsES } from "@mui/x-date-pickers/locales";

const customTheme = createTheme(
    {
        palette: {
            primary: { main: "#1976d2" },
        },
    },
    pickersEsES,
    coreEsES,
);

const extendedTheme = extendTheme(customTheme);

export default customTheme;
export { extendedTheme };
