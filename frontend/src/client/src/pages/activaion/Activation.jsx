import React, {memo, useEffect, useState} from 'react';
import {Alert, Box, CircularProgress, Paper, Typography} from "@mui/material";
import {useActivate} from "../../entities/viewer/index.js";
import {useParams} from "react-router-dom";

const Activation = memo(() => {
    const {uidb64, token} = useParams();
    const {loading, errors, activateRequest} = useActivate(uidb64, token);
    const [result, setResult] = useState(0);

    useEffect(() => {
        activateRequest().then(r => {
            if (r !== null) {
                setResult(1);
            } else {
                setResult(-1);
            }
        });
    }, []);

    return (
        <Box sx={{mt: 5}}>
            <Paper sx={{p: 5}}>
                <Typography variant="h5" sx={{textAlign: 'center'}}>Активация</Typography>
                <Typography variant="body1" sx={{textAlign: 'center', mt: 5}}>Подтверждение активации по ссылке из почты</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                    {
                        loading ?
                            <CircularProgress></CircularProgress>
                            :
                            (
                                result === 1 ?
                                    <Alert severity="success">Аккаунт успешно активирован</Alert>
                                    : (
                                        result === -1 ?
                                            <Alert severity="error">{errors?.detail}</Alert>
                                            : ""
                                    )

                            )
                    }

                </Box>
            </Paper>
        </Box>
    );
});

export default Activation;