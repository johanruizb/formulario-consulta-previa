import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

import PropTypes from "prop-types";

function CustomSupense({ children }) {
    return (
        <Suspense
            fallback={
                <Backdrop
                    open={true}
                    sx={{
                        bgcolor: "transparent",
                    }}
                >
                    <CircularProgress />
                </Backdrop>
            }
        >
            {children}
        </Suspense>
    );
}

CustomSupense.propTypes = {
    children: PropTypes.node.isRequired,
};

export default CustomSupense;
