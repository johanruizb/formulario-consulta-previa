import { Grid, Paper, TextField } from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";

const DocumentField = forwardRef(function DocumentField(props, ref) {
    const { getInputProps } = props;

    useImperativeHandle(ref, () => ({
        focus: () => {
            ref?.current?.focus();
        },
    }));

    return (
        <Paper
            elevation={0}
            sx={{
                minHeight: (56 + 19.91) * 3,
            }}
        >
            <input {...getInputProps()} />
        </Paper>
    );
});

DocumentField.propTypes = {
    getInputProps: PropTypes.func,
};

function FrontDocumentImage() {
    const { getRootProps, getInputProps } = useDropzone();
    const { ref, ...rootProps } = getRootProps();

    return (
        <TextField
            {...rootProps}
            ref={ref}
            fullWidth
            InputProps={{
                inputComponent: DocumentField,
                inputProps: { getInputProps },
            }}
        />
    );
}

function DocumentImage() {
    return (
        <Grid container spacing={1.25}>
            <Grid item xs={12} md={6}>
                <FrontDocumentImage />
            </Grid>
        </Grid>
    );
}

export default DocumentImage;
