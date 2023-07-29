import React, {memo,} from 'react';
import {Alert, Grid} from "@mui/material";

const ErrorsBag = memo(({errors, setErrors}) => {

    return (
        <Grid container spacing={1}>
            {errors.map(error =>
                <Grid item xs={12} key={error}>
                    <Alert severity="error" onClose={() => setErrors(errors.filter(err => err !== error))}>{error}</Alert>
                </Grid>
            )}
        </Grid>
    );
});

export default ErrorsBag;