import React from 'react';
import {List} from "@mui/material";

const ResourceList = ({children}) => {
    return (
        <List sx={{ bgcolor: 'background.paper' }}>
            {children}
        </List>
    );
};

export default ResourceList;