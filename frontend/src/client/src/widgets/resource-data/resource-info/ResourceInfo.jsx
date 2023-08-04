import React from 'react';
import ResourceInfoSection from "../../../entities/resource/ui/ResourceInfoSection.jsx";
import {Box} from "@mui/material";
import ResourceFavorites from "../../../features/resource-favorites/ResourceFavorites.jsx";
import {ResourceDownloads} from "../../../features/resource-downloads/index.js";

const ResourceInfo = ({loading, requested, resource}) => {
    return (
        <>
            <Box sx={{mt: 5}}>
                {!loading && requested > 0 ?
                    <ResourceInfoSection
                        resource={resource}
                        mainActions={
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: "space-between", gap: 1}}>
                                <ResourceFavorites reverse={true} resource={resource}></ResourceFavorites>
                                {
                                    resource.type === "file" ? (
                                        <ResourceDownloads reverse={true} resource={resource} open={() => {}}></ResourceDownloads>
                                    ) : ""
                                }
                            </Box>
                        }
                    />
                    : ""
                }
            </Box>
        </>
    );
};

export default ResourceInfo;