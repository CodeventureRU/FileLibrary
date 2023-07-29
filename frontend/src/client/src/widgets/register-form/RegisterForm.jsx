import React, {useEffect, useState} from 'react';
import {useRegister} from "../../entities/viewer/index.js";
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ErrorsBag} from "../../shared/ui/errors-bag/index";
import {LoadingButton} from "../../shared/ui/loading-button/index.js";
import {GridFormControl} from "../../shared/ui/grid-form-control/index.js";

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
                            <GridFormControl
                                field={email}
                                setField={setEmail}
                                label="Email"
                                errors={errors?.email}
                            />

                            <GridFormControl
                                field={username}
                                setField={setUsername}
                                label="Имя пользователя"
                                errors={errors?.username}
                            />

                            <GridFormControl
                                gridOptions={{xs: 12, md: 6}}
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
                                gridOptions={{xs: 12, md: 6}}
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