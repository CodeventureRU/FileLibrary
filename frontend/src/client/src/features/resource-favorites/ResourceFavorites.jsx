import React from 'react';
import {Box, IconButton, Typography} from "@mui/material";
import {Favorite} from "@mui/icons-material";

const ResourceFavorites = ({resource, reverse=false}) => {
    return (
        <Box sx={{display: "flex", alignItems: "center"}}>
            {
                reverse ? (
                    <IconButton sx={{width: '24px', height: '24px'}}>
                        <Favorite sx={{width: '16px', height: '16px'}} ></Favorite>
                    </IconButton>
                ) : ""
            }
            <Typography variant="body2" color="text.secondary">{resource.num_favorites}</Typography>
            {
                !reverse ? (
                    <IconButton sx={{width: '24px', height: '24px'}}>
                        <Favorite sx={{width: '16px', height: '16px'}} ></Favorite>
                    </IconButton>
                ) : ""
            }
        </Box>
    );
};

export default ResourceFavorites;