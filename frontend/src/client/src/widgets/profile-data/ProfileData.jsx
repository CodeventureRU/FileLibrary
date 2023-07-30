import React, { useState } from 'react';
import {Typography, IconButton, Paper, Box, alpha} from '@mui/material';
import {
    CheckCircle,
    HourglassTop,
    MoreVert,
} from '@mui/icons-material';
import {useViewerStore, viewerSelector} from "../../entities/viewer/index.js";
import {NavLink} from "react-router-dom";

const ProfileData = () => {
    const viewer = useViewerStore(viewerSelector);
    const [showEmail, setShowEmail] = useState(false);

    return (
        <Box sx={{mt: 5}}>
            <Typography variant="h6">Личный кабинет</Typography>
            <Paper variant="outlined" sx={{p: 3, mt: 2}}>
                <Box sx={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Имя пользователя</Typography>
                        <Typography variant="h6">{viewer.username}</Typography>
                        <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', mt: 2, flexWrap: 'wrap'}}>
                            <Box sx={{mr: 3}}>
                                <Typography variant="caption" color="text.secondary">Email</Typography>
                                <Box onClick={() => setShowEmail(!showEmail)} sx={{py: '5px'}}>
                                    {showEmail ?
                                        <Typography variant="body2">{viewer.email}</Typography>
                                        :
                                        <Typography color="primary" variant="body2" sx={{cursor: 'pointer'}}><b>Показать</b></Typography>
                                    }
                                </Box>
                            </Box>
                            {
                                viewer.is_active ?
                                    <Box sx={{display: 'inline-flex', alignItems: 'center', gap: '2px', borderRadius: '5px', p: "3px 8px", bgcolor: theme => alpha(theme.palette.primary.main, 0.1), color: "primary"}}>
                                        <CheckCircle color="primary" sx={{width: 16}}></CheckCircle >
                                        <Typography color="primary" variant="body2">Подтвержден</Typography>
                                    </Box>
                                    :
                                    <Box sx={{display: 'inline-flex', alignItems: 'center', gap: '2px', borderRadius: '5px', p: "3px 8px", bgcolor: alpha("#607d8b", 0.1), color: "primary"}}>
                                        <HourglassTop color="#607d8b" sx={{width: 16, color: "#607d8b"}}></HourglassTop >
                                        <Typography color="#607d8b" variant="body2">Ожидает подтверждения</Typography>
                                    </Box>
                            }

                        </Box>

                    </Box>

                    <NavLink to="/profile/settings"><IconButton color="primary" onClick={() => {}}>
                        <MoreVert />
                    </IconButton></NavLink>
                </Box>
            </Paper>
        </Box>
    );
};

export default ProfileData;