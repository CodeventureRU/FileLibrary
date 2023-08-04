import React, {lazy, Suspense} from 'react';
import {Box, Grid, Paper, Typography} from "@mui/material";
import {dateToFormat} from "../lib/index.js";
import {NavLink} from "react-router-dom";

const TagIcon = lazy(() => import("@mui/icons-material/Tag"));
const GroupIcon = lazy(() => import("@mui/icons-material/Folder"));
const FileIcon = lazy(() => import("@mui/icons-material/InsertDriveFile"));
const AccountIcon = lazy(() => import("@mui/icons-material/AccountCircle"));
const UploadIcon = lazy(() => import("@mui/icons-material/Upload"));


// Типы ресурсов, икнонки и имена под них (файл/группа)
const resourcesTypes = {
    group: {
        icon: <Suspense fallback={"..."}><GroupIcon sx={{width: "20px", mt: "-2px"}} /></Suspense>,
        name: "Группа"
    },
    file: {
        icon: <Suspense fallback={"..."}><FileIcon sx={{width: "20px", mt: "-2px"}} /></Suspense>,
        name: "Файл"
    },
};

const ResourceInfoSection = ({resource, mainActions=null, action=null}) => {
    return (
        <Paper variant="outlined" sx={{p: 3}}>
            <Grid container spacing={3}>
                {
                    resource.image ?
                        <Grid item xs={12} md={12}>
                            <Paper elevation={1} sx={{position: "relative", borderRadius: '5px'}}><img alt={resource.name} src={resource.image} style={{display: 'block', width: '100%', height: '100%', borderRadius: '5px'}} /></Paper>
                        </Grid>
                    : ""
                }
                <Grid item xs={12}>
                    <Typography variant="caption">{resourcesTypes[resource.type].name}</Typography>
                    <Box
                        sx={{display: 'flex', alignItems: 'start', justifyContent: 'space-between'}}
                    >
                        <Typography variant="h5">{resource.name}</Typography>
                        {
                            action
                        }
                    </Box>

                    <Typography variant="caption"><UploadIcon sx={{mb: '-3px', width: '14px', height: '14px'}} /> {dateToFormat(resource.created_at, 'dd MM yyyy')}</Typography><br/>
                    <NavLink to={`/user/${resource.author}`} style={{color: "inherit", textTransform: "none", textDecoration: "none"}}><Typography variant="caption"><Typography component="span" variant="caption" color="primary"><AccountIcon sx={{mb: '-3px', width: '14px', height: '14px'}} /> {resource.author}</Typography></Typography></NavLink><br/>
                    {
                        resource.tags !== "" ?
                            <><Typography variant="caption"><TagIcon sx={{mb: '-3px', width: '14px', height: '14px'}} /> {resource.tags}</Typography><br/></>
                        : ""
                    }


                    <Typography variant="body2" color="text.secondary" sx={{my: 3}}>
                        {resource.description}
                    </Typography>
                    {
                        mainActions
                    }
                </Grid>
            </Grid>

        </Paper>
    );
};

export default ResourceInfoSection;