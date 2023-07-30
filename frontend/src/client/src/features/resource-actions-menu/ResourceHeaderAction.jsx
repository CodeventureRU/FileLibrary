import React from 'react';
import {IconButton} from "@mui/material";
import {MoreVert} from "@mui/icons-material";

const ResourceHeaderAction = ({open, resource}) => {
    return (
        <IconButton
        size="small"
        onClick={e => open(e, resource)}
        >
            <MoreVert />
        </IconButton>
    );
};

export default ResourceHeaderAction;