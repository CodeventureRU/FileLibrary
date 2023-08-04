import React from 'react';
import {Box, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";

const UserProfileHeader = () => {
    const {username} = useParams();

    return (
        <Box sx={{mt: 5}}>
            <Typography variant="h6">Страница пользователя</Typography>
            <Paper variant="outlined" sx={{p: 3, mt: 2}}>
                <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Имя пользователя</Typography>
                        <Typography variant="h6">{username}</Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserProfileHeader;