import React, {useEffect, useState} from 'react';
import {ResourceInfo} from "../../widgets/resource-data/resource-info/index.js";
import {useParams} from "react-router-dom";
import {useFetchResource} from "../../entities/resource/index.js";
import {FileData} from "../../widgets/resource-data/file-data/index.js";
import {ResourcePageFeedback} from "../../features/resource-page-feedback/index.js";
import {GroupResourcesList} from "../../widgets/resources-lists/index.js";
import {Box, Typography} from "@mui/material";

const Resource = () => {
    const {resource: resourceId} = useParams();

    const {loading, errors, fetchResourceRequest, requested} = useFetchResource(resourceId);
    const [resource, setResource] = useState({});

    useEffect(() => {
        fetchResourceRequest().then(r => {
            if (r !== null) {
                setResource(r);
            }
        });
    }, [resourceId]);

    return (
        <ResourcePageFeedback
            errors={errors}
            requested={requested}
            loading={loading}
            content={<>
                <ResourceInfo loading={loading} requested={requested} resource={resource} />
                {
                    resource.type === 'file' ?
                        <FileData loading={loading} requested={requested} resource={resource} />
                        :
                        <Box sx={{mt: 4}}>
                            <Typography variant="h6">Файлы группы</Typography>
                            <GroupResourcesList resource={resourceId} />
                        </Box>


                }
            </>}

        />
    );
};

export default Resource;