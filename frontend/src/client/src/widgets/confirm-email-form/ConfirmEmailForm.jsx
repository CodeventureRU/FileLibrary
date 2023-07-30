import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useConfirmEmail, useLogin} from "../../entities/viewer/index.js";
import {Alert, Box, CircularProgress, Grid, Paper, Typography} from "@mui/material";
import {GridFormControl} from "../../shared/ui/grid-form-control/index.js";
import {LoadingButton} from "../../shared/ui/loading-button/index.js";
import {ErrorsBag} from "../../shared/ui/errors-bag/index.js";

const ConfirmEmailForm = () => {
    const {uidb64, token, email} = useParams();
    const {loading, errors, requested, confirmEmailRequest} = useConfirmEmail(uidb64, token, email);
    const {loginRequest} = useLogin(uidb64, token);
    const [result, setResult] = useState(0);
    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");


    const confirmEmailHandle = async () => {
        confirmEmailRequest(login, password).then(r => {
            if (r !== null) {
                setResult(1);
                loginRequest(login, password);
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
                        <Typography variant="h5" sx={{textAlign: 'center'}}>Обновление почты</Typography>
                        <Typography variant="body1" sx={{textAlign: 'center', mt: 5}}>Введите старый логин и пароль</Typography>
                        <Grid container spacing={2} sx={{mt: 3}}>
                            <GridFormControl
                                field={login}
                                setField={setLogin}
                                label="Логин (прошлый)"
                                errors={errors?.login}
                            />

                            <GridFormControl
                                field={password}
                                setField={setPassword}
                                label="Пароль"
                                textFieldOptions={{
                                    onCut: e => e.preventDefault(),
                                    onCopy: e => e.preventDefault(),
                                    onPaste: e => e.preventDefault(),
                                    type: "password"
                                }}
                                errors={errors?.password}
                            />
                            <Grid item sx={{display: 'flex', justifyContent: 'center'}} xs={12}>
                                <LoadingButton loading={loading} onClick={confirmEmailHandle}>Обновить почту</LoadingButton>
                            </Grid>
                        </Grid>
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                            {
                                loading ?
                                    <CircularProgress></CircularProgress>
                                    :
                                    (
                                        result === 1 ?
                                            <Alert severity="success">Email успешно обновлён</Alert>
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

export default ConfirmEmailForm;