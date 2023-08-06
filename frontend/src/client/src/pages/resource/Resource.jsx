import React, {useEffect, useState} from 'react';
import {ResourceInfo} from "../../widgets/resource-data/resource-info/index.js";
import {useParams} from "react-router-dom";
import {useFetchResource} from "../../entities/resource/index.js";
import {FileData} from "../../widgets/resource-data/file-data/index.js";
import {ResourcePageFeedback} from "../../features/resource-page-feedback/index.js";

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
    }, []);

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
                        : "данные группы"
                }
            </>}

        />
    );
};

export default Resource;