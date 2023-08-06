import React, {useEffect, useState} from 'react';
import {Box, CircularProgress} from "@mui/material";
import {ErrorsBag} from "../../shared/ui/errors-bag/index.js";

const ResourcePageFeedback = ({loading, errors, requested, content}) => {

    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);

    return (
        <>
            {
                (loading || requested === 0) ? (
                    <Box sx={{mt: 5, display: "flex", justifyContent: "center"}}>
                        <CircularProgress />
                    </Box>
                ) : (
                    errors.detail ? (
                        <Box sx={{mt: 5}}>
                            <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}></ErrorsBag>
                        </Box>
                    ) : (
                        content
                    )

                )
            }
        </>
    );
};

export default ResourcePageFeedback;