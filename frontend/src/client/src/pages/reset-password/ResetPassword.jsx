import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useResetPassword} from "../../entities/viewer/index.js";
import {Alert, Box, CircularProgress, Grid, Paper, Typography} from "@mui/material";
import {GridFormControl} from "../../shared/ui/grid-form-control/index.js";
import {ErrorsBag} from "../../shared/ui/errors-bag/index.js";
import {LoadingButton} from "../../shared/ui/loading-button/index.js";

const ResetPassword = () => {
    const {uidb64, token} = useParams();
    const {loading, errors, requested, resetPasswordRequest} = useResetPassword(uidb64, token);
    const [result, setResult] = useState(0);
    const [detailsErrors, setDetailsErrors] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);

    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const resetPasswordHandle = () => {
        resetPasswordRequest(password, passwordConfirm).then(r => {
            if (r !== null) {
                setResult(1);
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setResult(-1);
            }
        });
    };

    return (
        <Grid container sx={{justifyContent: 'center', mt: 5}}>
            <Grid item xs={12} md={6}>
                <Box sx={{mt: 5}}>
                    <Paper sx={{p: 5}} variant="outlined" elevation={0}>
                        <Typography variant="h5" sx={{textAlign: 'center'}}>Сброс пароля</Typography>
                        <Typography variant="body1" sx={{textAlign: 'center', mt: 5}}>Введие новый пароль</Typography>
                        <Grid container spacing={2} sx={{mt: 3}}>
                            <GridFormControl
                                field={password}
                                setField={setPassword}
                                label="Пароль"
                                textFieldOptions={{
                                    onCut: e => e.preventDefault(),
                                    onCopy: e => e.preventDefault(),
                                    type: "password"
                                }}
                                errors={errors?.password}
                            />

                            <GridFormControl
                                field={passwordConfirm}
                                setField={setPasswordConfirm}
                                label="Подтверждение"
                                textFieldOptions={{
                                    onCut: e => e.preventDefault(),
                                    onCopy: e => e.preventDefault(),
                                    onPaste: e => e.preventDefault(),
                                    type: "password"
                                }}
                                errors={errors?.confirm_password}
                            />
                            <Grid item sx={{display: 'flex', justifyContent: 'center'}} xs={12}>
                                <LoadingButton loading={loading} onClick={resetPasswordHandle}>Установить пароль</LoadingButton>
                            </Grid>
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                            {
                                loading ?
                                    <CircularProgress></CircularProgress>
                                    :
                                    (
                                        result === 1 ?
                                            <Alert severity="success">Пароль успешно обновлён</Alert>
                                            : ""

                                    )
                            }
                        </Box>
                        <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors} />
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ResetPassword;