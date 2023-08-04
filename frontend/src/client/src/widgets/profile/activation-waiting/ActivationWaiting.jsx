import React from 'react';
import {Box, Paper, Typography} from "@mui/material";
import {useResendEmail} from "../../../entities/viewer/index.js";
import {LoadingButton} from "../../../shared/ui/loading-button/index.js";
import {useThrottleTimer} from "../../../features/throttle-timer/index.js";

const ActivationWaiting = () => {
    const {resendRequest, errors, loading, requested} = useResendEmail();
    const {isWaiting, remainsText} = useThrottleTimer(errors, requested);

    return (
        <Box sx={{mt: 5}}>
            <Typography variant="h6">Ожидание подтверждения</Typography>
            <Paper sx={{p: 3, mt: 2}} variant="outlined">
                <Typography variant="body1">Для полного доступа к сервису, пожалуйста, подтвердите активацию учетной записи по почте. На Вашу почту отправлено письмо с ссылкой для активации.</Typography>
                <Box sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 3}}>
                    <LoadingButton disabled={isWaiting} loading={loading} onClick={resendRequest}>Отправить повторно</LoadingButton>
                    {isWaiting ? <Typography variant="body2" color="text.secondary" sx={{ml: 3}}>{remainsText}</Typography> : ""}
                </Box>
            </Paper>
        </Box>
    );
};

export default ActivationWaiting;