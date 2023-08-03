import React, {useEffect, useState} from 'react';
import {ResourceInfo} from "../../widgets/resource-info/index.js";
import {useParams} from "react-router-dom";
import {useFetchResource} from "../../entities/resource/index.js";
import {Alert, Box} from "@mui/material";
import {FileData} from "../../widgets/file-data/index.js";

const Resource = () => {
    const {resource: resourceId} = useParams();
    const {loading, errors, fetchResourceRequest, requested} = useFetchResource(resourceId);
    const [resource, setResource] = useState({});

    useEffect(() => {
        fetchResourceRequest().then(r => {
            setResource(r);
        });
    }, []);

    return (
        <div>
            {
                errors?.detail ? (
                    <Box sx={{mt: 5}}>
                        <Alert severity="error">Страница не найдена</Alert>
                    </Box>
                ) : (
                    <>
                        <ResourceInfo loading={loading} requested={requested} resource={resource} />
                        {
                            resource.type === 'file' ?
                                <FileData loading={loading} requested={requested} resource={resource} />
                                : "данные группы"
                        }
                    </>
                )
            }

        </div>
    );
};

export default Resource;