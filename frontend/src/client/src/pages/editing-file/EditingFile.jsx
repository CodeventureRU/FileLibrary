import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetchResource} from "../../entities/resource/index.js";
import {ResourcePageFeedback} from "../../features/resource-page-feedback/index.js";
import {EditingFileForm} from "../../widgets/resource-forms/index.js";

const EditingFile = () => {
    const {resource: resourceId} = useParams();
    const {loading, errors, fetchResourceRequest, requested} = useFetchResource(resourceId);
    const [resource, setResource] = useState({});

    useEffect(() => {
        fetchResourceRequest().then(r => {
            setResource(r);
        });
    }, []);

    return (
        <ResourcePageFeedback
            loading={loading}
            errors={errors}
            requested={requested}
            content={
                <EditingFileForm resource={resource} />
            }
        />
    );
};

export default EditingFile;