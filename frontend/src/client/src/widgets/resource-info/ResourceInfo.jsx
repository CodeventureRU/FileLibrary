import React from 'react';
import ResourceInfoSection from "../../entities/resource/ui/ResourceInfoSection.jsx";
import {Box} from "@mui/material";

const ResourceInfo = ({loading, requested, resource}) => {

    return (
        <Box sx={{mt: 5}}>
            {!loading && requested > 0 ?
                <ResourceInfoSection resource={resource} />
                : ""
            }

        </Box>
    );
};

export default ResourceInfo;