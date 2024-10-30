import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";

import { isDevelopment } from "../../utils/isProduction";

const Counter = ({ renderCount, className }) => {
    return (
        <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            sx={{
                pr: "14px",
            }}
        >
            <ArrowDropDownIcon
                className={className}
                sx={{
                    position: "unset !important",
                }}
            />
            {isDevelopment && (
                <Typography variant="caption">{renderCount}</Typography>
            )}
        </Stack>
    );
};

Counter.propTypes = {
    renderCount: PropTypes.number.isRequired,
    className: PropTypes.string,
};

export default Counter;
