import React, {useEffect, useState} from 'react';
import {useSendResetPassword} from "../../../entities/viewer/index.js";
import {Box, Grid, Paper, Typography} from "@mui/material";
import {GridFormControl} from "../../../shared/ui/grid-form-control/index.js";
import {ErrorsBag} from "../../../shared/ui/errors-bag/index.js";
import {LoadingButton} from "../../../shared/ui/loading-button/index.js";
import {useThrottleTimer} from "../../../features/throttle-timer/index.js";

const SendResetPasswordForm = () => {
    const {errors, loading, sendResetPasswordRequest, requested} = useSendResetPassword();
    const {isWaiting, remainsText} = useThrottleTimer(errors, requested);
    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        let detailError = errors?.detail ? (errors?.detail === "Страница не найдена." ? "Пользователь не найден" : "") : "";
        setDetailsErrors(errors?.detail ? [detailError] : []);
    }, [errors, requested]);

    const [login, setLogin] = useState("");

    const sendResetPasswordHandle = async () => {
        await sendResetPasswordRequest(login);
    }


    return (
        <Grid container sx={{justifyContent: 'center', mt: 5}}>
            <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{p: 5}} elevation={0}>
                    <Typography variant="h5" sx={{textAlign: 'center'}}>Восстановление пароля</Typography>
                    <Box
                        sx={{mt: 5}}
                    >
                        <Grid container spacing={2}>

                            <GridFormControl
                                field={login}
                                setField={setLogin}
                                label="Логин (email или имя пользователя)"
                                errors={errors?.username}
                            />

                            <Grid item xs={12}>
                                <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}></ErrorsBag>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, flexDirection: 'column', gap: 2}}
                        >
                            <LoadingButton disabled={isWaiting} loading={loading} onClick={sendResetPasswordHandle} buttonProps={{sx: {textTransform: 'none'}}}>Отправить письмо</LoadingButton>
                            {isWaiting ? <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center'}}>{remainsText}</Typography> : ""}
                        </Box>
                    </Box>

                </Paper>
            </Grid>

        </Grid>

    );
};

export default SendResetPasswordForm;