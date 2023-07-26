import React, {useEffect, useState} from 'react';
import {useLogin} from "../../entities/viewer/index.js";
import {
    Box,
    Button, CircularProgress,
    FormControl,
    Grid,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import helperTextError from "../../features/helper-text-error/index.js";
import {ErrorsBag} from "../../features/errors-bag/index";

const LoginForm = () => {
    const {errors, loading, loginRequest, requested} = useLogin();
    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginHandle = async () => {
        let res = await loginRequest(username, password);
        if (res != null) {
            navigate("/profile");
        }
    }


    return (
        <Grid container sx={{justifyContent: 'center', mt: 5}}>
            <Grid item xs={12} md={6}>
                <Paper sx={{p: 5}}>
                    <Typography variant="h5" sx={{textAlign: 'center'}}>Вход</Typography>
                    <Box
                        sx={{my: 5}}
                    >
                        <Grid container spacing={2}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
                                <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}></ErrorsBag>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5}}
                        >
                            <Button href="/register">Зарегистрироваться</Button>
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <Button
                                    variant="contained"
                                    onClick={loginHandle}
                                    disabled={loading}
                                >
                                    Войти
                                </Button>
                                {loading && (
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            color: 'primary',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-12px',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                </Paper>
            </Grid>

        </Grid>

    );
};

export default LoginForm;