import React, {useEffect, useState} from 'react';
import {useUpdatePassword} from "../../../entities/viewer/index.js";
import {Alert, Grid} from "@mui/material";
import {GridFormControl} from "../../../shared/ui/grid-form-control/index.js";
import {LoadingButton} from "../../../shared/ui/loading-button/index.js";
import {ErrorsBag} from "../../../shared/ui/errors-bag/index.js";

const PasswordForm = () => {
    const {errors, loading, updatePasswordRequest, requested} = useUpdatePassword();
    const [detailsErrors, setDetailsErrors] = useState([]);
    const [success, setSuccess] = useState(false);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);

    const updatePasswordHandler = async () => {
        let res = await updatePasswordRequest(currentPassword, password, passwordConfirm);
        if (res !== null) {
            setSuccess(true);
        }
    }

    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    return (
        <div>
            <Grid container sx={{mt: 2}} spacing={2}>
                <GridFormControl
                    field={currentPassword}
                    setField={setCurrentPassword}
                    label={"Текущий пароль"}
                    errors={errors?.current_password}
                    textFieldOptions={{
                        onCut: e => e.preventDefault(),
                        onCopy: e => e.preventDefault(),
                        type: "password"
                    }}
                />
                <GridFormControl
                    field={password}
                    setField={setPassword}
                    label={"Новый пароль"}
                    errors={errors?.password}
                    textFieldOptions={{
                        onCut: e => e.preventDefault(),
                        onCopy: e => e.preventDefault(),
                        type: "password"
                    }}
                />
                <GridFormControl
                    field={passwordConfirm}
                    setField={setPasswordConfirm}
                    label={"Новый пароль (подтверждение)"}
                    errors={errors?.confirm_password}
                    textFieldOptions={{
                        onCut: e => e.preventDefault(),
                        onCopy: e => e.preventDefault(),
                        onPaste: e => e.preventDefault(),
                        type: "password"
                    }}
                />
                <Grid item xs={12}>
                    <LoadingButton variant="contained" loading={loading} disabled={false} onClick={updatePasswordHandler}>Сохранить</LoadingButton>
                </Grid>
                <Grid item xs={12}>
                    {
                        errors?.detail ? (
                            <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors} />
                        ) : ""
                    }
                    {
                        success ? (
                            <Alert severity="success" onClose={() => setSuccess(false)} >Пароль успешно изменен</Alert>
                        ) : ""
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default PasswordForm;