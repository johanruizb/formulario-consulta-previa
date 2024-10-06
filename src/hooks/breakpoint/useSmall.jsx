import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

function useSmall() {
    const theme = useTheme();
    const small = useMediaQuery(theme.breakpoints.down("md"));

    return small;
}

export default useSmall;
