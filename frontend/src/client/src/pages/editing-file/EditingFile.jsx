import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetchResource} from "../../entities/resource/index.js";
import {EditingFileForm} from "../../widgets/resource-forms/index.js";
import {Box, CircularProgress} from "@mui/material";
import {ErrorsBag} from "../../shared/ui/errors-bag/index.js";

const EditingFile = () => {
    const {resource: resourceId} = useParams();
    const {loading, errors, fetchResourceRequest, requested} = useFetchResource(resourceId);
    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);
    const [resource, setResource] = useState({});

    useEffect(() => {
        fetchResourceRequest().then(r => {
            setResource(r);
        });
    }, []);

    return (
        <>
            {
                (loading || requested === 0) ? (
                    <Box sx={{mt: 5, display: "flex", justifyContent: "center"}}>
                        <CircularProgress />
                    </Box>
                ) : (
                    errors.detail ? (
                        <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}></ErrorsBag>
                    ) : (
                        <EditingFileForm
                            resource={resource}
                        />
                    )

                )
            }
        </>
    );
};

export default EditingFile;