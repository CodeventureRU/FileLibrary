import React from 'react';
import {Box, IconButton, Typography} from "@mui/material";
import {Favorite} from "@mui/icons-material";

const ResourceFavorites = ({resource}) => {
    return (
        <Box sx={{display: "flex", alignItems: "center"}}>
            <IconButton>
                <Favorite sx={{width: '16px', height: '16px'}} ></Favorite>
            </IconButton>
            <Typography variant="body2" color="text.secondary">{resource.num_favorites}</Typography>
        </Box>
    );
};

export default ResourceFavorites;