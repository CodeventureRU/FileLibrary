import React, {useEffect, useState} from 'react';
import {useRegister} from "../../entities/viewer/index.js";
import {
    Box,
    Button,
    FormControl,
    Grid,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import helperTextError from "../../features/helper-text-error/index.js";
import {ErrorsBag} from "../../features/errors-bag/index";
import {LoadingButton} from "../../shared/ui/loading-button/index.js";

const RegisterForm = () => {
    const {errors, loading, registerRequest, requested} = useRegister();
    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const registerHandle = async () => {
        let res = await registerRequest(email, username, password, passwordConfirm);
        if (res != null) {
            navigate("/profile");
        }
    }

    return (
        <Grid container sx={{justifyContent: 'center', mt: 5}}>
            <Grid item xs={12} md={6}>
                <Paper sx={{p: 5}}>
                    <Typography variant="h5" sx={{textAlign: 'center'}}>Регистрация</Typography>
                    <Box
                        sx={{my: 5}}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth={true}
                                >
                                    <TextField
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        label="Email"
                                        variant="outlined"
                                        error={Boolean(errors?.email)}
                                        helperText ={helperTextError(errors?.email)}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth={true}
                                >
                                    <TextField
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        label="Имя пользователя"
                                        variant="outlined"
                                        error={Boolean(errors?.username)}
                                        helperText ={helperTextError(errors?.username)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl
                                    fullWidth={true}
                                >
                                    <TextField
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        label="Пароль"
                                        type="password"
                                        variant="outlined"
                                        error={Boolean(errors?.password)}
                                        helperText ={helperTextError(errors?.password)}
                                        onCut={e => e.preventDefault()}
                                        onCopy={e => e.preventDefault()}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl
                                    fullWidth={true}
                                >
                                    <TextField
                                        value={passwordConfirm}
                                        onChange={e => setPasswordConfirm(e.target.value)}
                                        label="Подтверждение пароля"
                                        type="password"
                                        variant="outlined"
                                        error={Boolean(errors?.confirm_password)}
                                        helperText ={helperTextError(errors?.confirm_password)}
                                        onCut={e => e.preventDefault()}
                                        onCopy={e => e.preventDefault()}
                                        onPaste={e => e.preventDefault()}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}></ErrorsBag>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5}}
                        >
                            <Button href="/login">Войти</Button>
                            <LoadingButton loading={loading} onClick={registerHandle}>Зарегистрироваться</LoadingButton>
                        </Box>
                    </Box>

                </Paper>
            </Grid>

        </Grid>

    );
};

export default RegisterForm;