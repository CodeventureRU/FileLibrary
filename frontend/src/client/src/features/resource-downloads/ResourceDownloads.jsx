import React from 'react';
import {Box, IconButton, Typography} from "@mui/material";
import {Download} from "@mui/icons-material";

const ResourceDownloads = ({resource, open, reverse=false}) => {
    return (
        <Box sx={{display: "flex", alignItems: "center"}}>
            {
                reverse ? (
                    <IconButton onClick={e => open(e, resource)} sx={{width: '24px', height: '24px'}}>
                        <Download sx={{width: '16px', height: '16px'}} ></Download>
                    </IconButton>
                ) : ""
            }
            <Typography variant="body2" color="text.secondary">{resource?.file?.downloads}</Typography>
            {
                !reverse ? (
                    <IconButton onClick={e => open(e, resource)} sx={{width: '24px', height: '24px'}}>
                        <Download sx={{width: '16px', height: '16px'}} ></Download>
                    </IconButton>
                ) : ""
            }
        </Box>
    );
};

export default ResourceDownloads;