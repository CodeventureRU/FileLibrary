import React, {useEffect, useState} from 'react';
import {useUpdateUsername, useVerify, useViewerStore, viewerSelector} from "../../../entities/viewer/index.js";
import {Alert, Grid} from "@mui/material";
import {GridFormControl} from "../../../shared/ui/grid-form-control/index.js";
import {LoadingButton} from "../../../shared/ui/loading-button/index.js";
import {ErrorsBag} from "../../../shared/ui/errors-bag/index.js";

const UsernameForm = ({}) => {
    const viewer = useViewerStore(viewerSelector);
    const {errors, loading, updateUsernameRequest, requested} = useUpdateUsername();
    const [detailsErrors, setDetailsErrors] = useState([]);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);
    const {verifyRequest} = useVerify();

    const updateUsernameHandler = async () => {
        await updateUsernameRequest(username);
        let resVerify = await verifyRequest();
        if (resVerify?.username === username) {
            setSuccess(true);
        }
    }

    const [username, setUsername] = useState(viewer.username);

    return (
        <div>
            <Grid container sx={{mt: 2}} spacing={2}>
                <GridFormControl
                    field={username}
                    setField={setUsername}
                    label={"Имя пользователя"}
                    errors={errors?.username}
                />
                <Grid item xs={12}>
                    <LoadingButton variant="contained" loading={loading} disabled={username === viewer.username || username === ""} onClick={updateUsernameHandler}>Сохранить</LoadingButton>
                </Grid>
                <Grid item xs={12}>
                    {
                        errors?.detail ? (
                            <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors} />
                        ) : ""
                    }
                    {
                        success ? (
                            <Alert severity="success" onClose={() => setSuccess(false)} >Имя пользователя успешно изменено</Alert>
                        ) : ""
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default UsernameForm;