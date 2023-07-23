import React, {lazy, Suspense} from 'react';
import {Box, ListItem, ListItemText, Typography} from "@mui/material";
import {dateToFormat} from "../lib/index.js";

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

const ResourceListItem = ({resource, headerActions=null, mainActions=null}) => {
    return (
        <ListItem
            secondaryAction={
                // действия справа
                headerActions ? headerActions : ""
            }
        >
            <ListItemText
                primary={
                // Основная инфомрация о ресурсе
                <Box sx={{display: "flex", alignItems: "start", gap: "10px", pb: "10px"}}>
                    {resourcesTypes[resource.type].icon}
                    <Typography variant="body2" color="text.secondary">{resource.title}</Typography>
                </Box>}
                secondary={
                    // Дополнительная информация о ресурсе
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0 50px'
                        }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            <UploadIcon sx={{mb: '-3px', width: '14px', height: '14px'}} /> {dateToFormat(resource.createdAt, "dd.mm.yyyy")}
                            <AccountIcon sx={{ml: "10px", mb: '-3px', width: '14px', height: '14px'}} /> {resource.username}
                        </Typography>
                        {
                            mainActions ? mainActions : ""
                        }
                        {/*<Typography variant="caption" color="text.secondary">*/}
                        {/*    <Download sx={{mb: '-3px', width: '14px', height: '14px'}} /> {154}*/}
                        {/*    <Favorite sx={{ml: "10px", mb: '-3px', width: '14px', height: '14px'}} /> {resource.favorites}*/}
                        {/*</Typography>*/}
                    </Box>

                }
            />
        </ListItem>
    );
};

export default ResourceListItem;