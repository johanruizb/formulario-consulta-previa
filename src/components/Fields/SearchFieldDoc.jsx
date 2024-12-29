// React
import React from 'react'
import PropTypes from "prop-types";

// Material IU
import {Grid2, Box, Button, TextField, Typography} from '@mui/material'

/**
 * 
 */
export default function SearchFieldDoc({ slotProps }) {
    console.log(slotProps,"slotProps")
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