import React, {useEffect, useState} from 'react';
import {useLogin} from "../../entities/viewer/index.js";
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import {ErrorsBag} from "../../shared/ui/errors-bag/index";
import {LoadingButton} from "../../shared/ui/loading-button/index.js";
import {GridFormControl} from "../../shared/ui/grid-form-control/index.js";

const LoginForm = () => {
    const {errors, loading, loginRequest, requested} = useLogin();
    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const loginHandle = async () => {
        let res = await loginRequest(login, password);
        if (res != null) {
            navigate("/profile");
        }
    }


    return (
        <>
        <Grid container sx={{justifyContent: 'center', mt: 5}}>
            <Grid item xs={12} md={6}>
                <Paper sx={{p: 5}} variant="outlined" elevation={0}>
                    <Typography variant="h5" sx={{textAlign: 'center'}}>Вход</Typography>
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
                            <Grid item xs={12} sx={{}}>
                                <NavLink style={{textDecoration: 'none', color: 'inherit'}} to={"/send-reset-password"}>
                                    <Typography variant="body2" color="primary">Забыли пароль?</Typography>
                                </NavLink>
                            </Grid>
                            {/*<Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>*/}
                            {/*    <NavLink style={{textDecoration: 'none', color: 'inherit'}} to={"/send-reset-password"}>*/}
                            {/*        <Typography variant="caption" color="primary">Забыли пароль?</Typography>*/}
                            {/*    </NavLink>*/}
                            {/*</Grid>*/}

                            <Grid item xs={12}>
                                <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}></ErrorsBag>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 5}}
                        >
                            <Button sx={{ml: -1, textTransform: 'none'}} href="/register">Зарегистрироваться</Button>
                            <LoadingButton loading={loading} onClick={loginHandle} buttonProps={{sx: {textTransform: 'none'}}}>Войти</LoadingButton>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
        </>
    );
};

export default LoginForm;