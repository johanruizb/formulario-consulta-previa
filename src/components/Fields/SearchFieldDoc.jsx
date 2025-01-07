// PropTypes
import PropTypes from "prop-types";

// Material IU
import {Box,TextField, Typography} from '@mui/material'

/**
 * 
 */
export default function SearchFieldDoc({ slotProps }) {
    const {
        text,
        label
    } = slotProps.field

    return (
        <Box className="container-search-doc">
            <Typography>
                {text}
            </Typography>
            <TextField
                fullWidth 
                label={label}
                id="search-doc"
                variant="filled"
            />
        </Box>
    )
}

SearchFieldDoc.propTypes = {
    slotProps: PropTypes.shape({
        field: PropTypes.shape({
            text: PropTypes.string,
            label: PropTypes.string,
        })
    }),
};