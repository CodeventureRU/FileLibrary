import React, {lazy, memo, Suspense} from 'react';
import {
    Card, CardActionArea,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography
} from "@mui/material";
import {dateToFormat} from "../lib/index.js";
import {NavLink} from "react-router-dom";

const GroupIcon = lazy(() => import("@mui/icons-material/Folder"));
const FileIcon = lazy(() => import("@mui/icons-material/InsertDriveFile"));
const AccountIcon = lazy(() => import("@mui/icons-material/AccountCircle"));
const UploadIcon = lazy(() => import("@mui/icons-material/Upload"));


// Типы ресурсов, икнонки и имена под них (файл/группа)
const resourcesTypes = {
    group: {
        icon: <Suspense fallback={"..."}><GroupIcon /></Suspense>,
        name: "Группа"
    },
    file: {
        icon: <Suspense fallback={"..."}><FileIcon /></Suspense>,
        name: "Файл"
    },
};

const ResourceCard = memo(({resource, headerAction=null, mainActions=null}) => {

    return (
        <Card>
            {/*
            Заголовок карточки: отражение типа ресурса (группа или файл)
            */}
            <CardHeader
                avatar={
                    resourcesTypes[resource.type].icon
                }
                action={
                    headerAction ? headerAction : ""
                }
                titleTypographyProps={{
                    variant: "body2",
                    color: "text.primary"
                }}
                title={
                    resourcesTypes[resource.type].name
                }
            />

            {/*
            Контент карточки: картинка и текст
            */}
            <NavLink to={`/resource/${resource.slug ? resource.slug : resource.id}`} style={{color: "inherit", textDecoration: "none"}}><CardActionArea>
                { resource.image ?
                    <CardMedia
                        component="img"
                        height="194"
                        image={resource.image}
                        alt={resource.name}
                    />
                    :
                    <CardMedia
                        component="div"
                        sx={{bgcolor: "#eee", height: '194px'}}
                    />
                }
                <CardContent>
                    <Suspense fallback={"..."}>
                        {/* Информация о ресурсе */}
                        <Typography variant="caption" color="text.secondary">
                            {/* Информация о дате создания */}
                            <UploadIcon sx={{mb: '-3px', width: '14px', height: '14px'}} /> {dateToFormat(resource.created_at, "dd.mm.yyyy")}
                            {/* Информация об авторе */}
                            <AccountIcon sx={{ml: "10px", mb: '-3px', width: '14px', height: '14px'}} /> {resource.author}
                        </Typography>
                    </Suspense>

                    {/* Название ресурса */}
                    <Typography variant="body2" color="text.secondary">
                        {resource.name}
                    </Typography>
                </CardContent>
            </CardActionArea></NavLink>
            {/*
            Действия скнизу карточки
            */}
            {mainActions
                ?
                <CardActions sx={{pt: 0}}>
                    {mainActions}
                </CardActions>
                :
                ""
            }

        </Card>
    );
});

export default ResourceCard;