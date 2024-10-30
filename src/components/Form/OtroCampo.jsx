import Grid from "@mui/material/Grid2";
import { useFormContext, useWatch } from "react-hook-form";

import PropTypes from "prop-types";

function OtroCampo({ slotProps }) {
    const { control } = useFormContext();
    const {
        OtherComponent: Component,
        size = { xs: 12, md: 6 },
        ...restSlotProps
    } = slotProps;

    const {
        controller: { dependencies, otherKey },
    } = restSlotProps;

    const values = useWatch({
        control,
        name: dependencies,
    });

    const isValid = otherKey === values;

    return (
        isValid && (
            <Grid size={size}>
                <Component slotProps={restSlotProps} />
            </Grid>
        )
    );
}

OtroCampo.propTypes = {
    slotProps: PropTypes.shape({
        OtherComponent: PropTypes.any,
        size: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    }),
};

export default OtroCampo;
