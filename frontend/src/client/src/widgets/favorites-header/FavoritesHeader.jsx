import React from 'react';
import {Box, Typography} from "@mui/material";

const FavoritesHeader = () => {
    return (
        <Box sx={{my: 5}}>
            <Typography variant="h6">Избранное</Typography>
        </Box>
    );
};

export default FavoritesHeader;