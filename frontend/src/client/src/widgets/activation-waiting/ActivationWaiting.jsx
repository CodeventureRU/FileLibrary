import React from 'react';
import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import {useViewerStore, viewerSelector} from "../../entities/viewer/index.js";

const ActivationWaiting = () => {
    const viewer = useViewerStore(viewerSelector);

    return (
        <Grid container sx={{justifyContent: 'center', mt: 5}}>
            <Grid item xs={12} md={12}>
                <Paper sx={{p: 5}}>
                    <Typography variant="h5" sx={{textAlign: 'center'}}>Ожидание подтверждения</Typography>
                    <Typography variant="body1" sx={{textAlign: 'center', mt: 5}}>Для полного доступа к сервису, пожалуйста, подтвердите активацию учетной записи по почте. На Вашу почту {viewer.email} отправлено письмо с ссылкой для активации.</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', mt: 5}}>Если Вы не получили письмо, то можете повторить отправку</Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                        <Button variant="contained">Отправить повторно</Button>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ActivationWaiting;