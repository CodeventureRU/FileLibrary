import React from 'react';
import {FormControl, Grid, TextField} from "@mui/material";
import helperTextError from "../../../features/helper-text-error/index.js";

const GridFormControl = ({field, setField, label, errors, variant="outlined", gridOptions={xs: 12}, textFieldOptions={}}) => {
    return (
        <Grid item {...gridOptions}>
            <FormControl
                fullWidth={true}
            >
                <TextField
                    value={field}
                    onChange={e => setField(e.target.value)}
                    label={label}
                    variant={variant}
                    error={Boolean(errors)}
                    helperText ={helperTextError(errors)}
                    {...textFieldOptions}
                />
            </FormControl>
        </Grid>
    );
};

export default GridFormControl;