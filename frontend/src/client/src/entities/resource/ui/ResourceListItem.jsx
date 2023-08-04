import React, {lazy, Suspense} from 'react';
import {Box, ListItem, ListItemText, Typography} from "@mui/material";
import {dateToFormat} from "../lib/index.js";
import {NavLink} from "react-router-dom";

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
                primaryTypographyProps={{component: "div"}}
                primary={
                // Основная инфомрация о ресурсе
                <NavLink to={`/resource/${resource.slug ? resource.slug : resource.id}`} style={{color: "inherit", textDecoration: "none"}}><Box sx={{display: "flex", alignItems: "start", gap: "10px", pb: "10px"}}>
                    {resourcesTypes[resource.type].icon}
                    <Typography variant="body2" color="text.secondary">{resource.name}</Typography>
                </Box></NavLink>}
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
                        <Suspense fallback={"..."}>
                            <Typography variant="caption" color="text.secondary">
                                <UploadIcon sx={{mb: '-3px', width: '14px', height: '14px'}} /> {dateToFormat(resource.created_at, "dd.mm.yyyy")}
                                <AccountIcon sx={{ml: "10px", mb: '-3px', width: '14px', height: '14px'}} /> {resource.author}
                            </Typography>
                        </Suspense>
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