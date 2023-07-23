import React from 'react';
import {Grid} from "@mui/material";

const ResourceGridItem = ({children}) => {
    return (
        <Grid item sm={6} xs={12} md={4}>
            {children}
        </Grid>
    );
};

export default ResourceGridItem;