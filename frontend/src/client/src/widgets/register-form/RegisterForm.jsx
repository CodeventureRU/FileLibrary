import React, {useState} from 'react';
import {useRegister} from "../../entities/viewer/index.js";
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

const RegisterForm = () => {
    const {errors, loading, registerRequest} = useRegister();
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
                                        error={errors?.email}
                                        helperText ={errors?.email}
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
                                        error={errors?.username}
                                        helperText ={errors?.username}
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
                                        error={errors?.password}
                                        helperText ={errors?.password}
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
                                        error={errors?.confirm_password}
                                        helperText ={errors?.confirm_password}
                                        onCut={e => e.preventDefault()}
                                        onCopy={e => e.preventDefault()}
                                        onPaste={e => e.preventDefault()}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5}}
                        >
                            <Button href="/login">Войти</Button>
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <Button
                                    variant="contained"
                                    onClick={registerHandle}
                                    disabled={loading}
                                >
                                    Зарегистрироваться
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

export default RegisterForm;