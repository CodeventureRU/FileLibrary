import React, {useEffect, useState} from 'react';
import {useUpdateEmail, useViewerStore, viewerSelector} from "../../../entities/viewer/index.js";
import {Alert, AlertTitle, Box, Grid, Typography} from "@mui/material";
import {GridFormControl} from "../../../shared/ui/grid-form-control/index.js";
import {LoadingButton} from "../../../shared/ui/loading-button/index.js";
import {ErrorsBag} from "../../../shared/ui/errors-bag/index.js";
import {useThrottleTimer} from "../../throttle-timer/index.js";

const EmailForm = () => {
    const viewer = useViewerStore(viewerSelector);
    const {errors, loading, updateEmailRequest, requested} = useUpdateEmail();
    const {isWaiting, remainsText} = useThrottleTimer(errors, requested);
    const [detailsErrors, setDetailsErrors] = useState([]);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);

    const updateEmailHandler = async () => {
        let res = await updateEmailRequest(email);
        if (res !== null) {
            setSuccess(true);
        }
    }

    const [email, setEmail] = useState(viewer.email);

    return (
        <div>
            <Grid container sx={{mt: 2}} spacing={2}>
                <GridFormControl
                    field={email}
                    setField={setEmail}
                    label={"Email"}
                    errors={errors?.email}
                />
                <Grid item xs={12}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <LoadingButton disabled={isWaiting || (email === viewer.email || email === "")} loading={loading} onClick={updateEmailHandler}>Сохранить</LoadingButton>
                        {isWaiting ? <Typography variant="body2" color="text.secondary" sx={{ml: 3}}>{remainsText}</Typography> : ""}
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {
                        errors?.detail ? (
                            <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors} />
                        ) : ""
                    }
                    {
                        success ? (
                            <Alert
                                severity="info"
                                onClose={() => setSuccess(false)}
                            >
                                <AlertTitle><b>На новый email отправлено письмо с подтверждением</b></AlertTitle>
                                Email будет обновлен после перехода по ссылке из письма, отправленного на указанную почту.
                            </Alert>
                        ) : ""
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default EmailForm;