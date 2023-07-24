import React, {useState} from 'react';
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

const LoginForm = () => {
    const {errors, loading, loginRequest} = useLogin();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandle = async () => {
        let res = await loginRequest(email, password);
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
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        label="Пароль"
                                        type="password"
                                        variant="outlined"
                                        error={errors?.password}
                                        helperText ={errors?.password}
                                    />
                                </FormControl>
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