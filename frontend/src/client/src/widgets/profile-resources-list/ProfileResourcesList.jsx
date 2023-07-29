import React, {useEffect, useState} from 'react';
import {ResourcesViewSettings, useFilterSort, useViewMode} from "../../features/resources-view-settings/index.js";
import {resourcesSelector, useFetchMyResources, useResourcesStore} from "../../entities/resource/index.js";
import ResourceList from "../../entities/resource/ui/ResourceList.jsx";
import {
    Box,
    CircularProgress,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import {ErrorsBag} from "../../shared/ui/errors-bag/index.js";
import ResourceListItem from "../../entities/resource/ui/ResourceListItem.jsx";
import ResourceGrid from "../../entities/resource/ui/ResourceGrid.jsx";
import ResourceGridItem from "../../entities/resource/ui/ResourceGridItem.jsx";
import ResourceCard from "../../entities/resource/ui/ResourceCard.jsx";
import {Delete, Edit, MoreVert} from "@mui/icons-material";
import {NavLink} from "react-router-dom";

const ProfileResourcesList = () => {
    const filterAndSortObj = useFilterSort();
    const viewModeObj = useViewMode();
    const {loadMore, loading, errors, requested} = useFetchMyResources();
    const resources = useResourcesStore(resourcesSelector);

    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);

    useEffect(() => {
        loadMore({
            sort: filterAndSortObj.sort,
            search: filterAndSortObj.search,
            type: filterAndSortObj.type,
        }, {
            page: 1,
            limit: 100,
        }, true);
    }, []);

    const apply = () => {
        console.log(filterAndSortObj);
    }

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [selectedResourceId, setSelectedResourceId] = useState(null);
    const handleMenuOpen = (event, resource) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedResourceId(resource.id);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setSelectedResourceId(null);
    };

    return (
        <div>
            <ResourcesViewSettings
                filterAndSortObj={filterAndSortObj}
                viewModeObj={viewModeObj}
                apply={apply}
            />
            <Box sx={{mt: 3}}>
            {
                ( loading || requested === 0 ) ? (
                    // Если загрузка, и при этом ни один запрос не завершен, выводим лоадер
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                        <CircularProgress />
                    </Box>
                ) : (
                    errors?.detail ? (
                        // Если загрузка завершена, и при этом есть ошибки, выводим список ошибок
                        <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}/>
                    ) : (
                        // Если загрузка завершена, и при этом ошибок нет, выводим список ресурсов
                        (viewModeObj.viewMode === "list") ? (
                            // Список ресурсов в виде списка
                            <ResourceList>
                                {resources.map(resource =>
                                    <>
                                        <Divider />
                                        <ResourceListItem
                                            headerActions={
                                                <IconButton
                                                    size="small"
                                                    onClick={e => handleMenuOpen(e, resource)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                            }
                                            resource={resource}
                                        />
                                    </>
                                )}
                            </ResourceList>
                        ) : (
                            // Список ресурсов в виде карточек
                            <ResourceGrid>
                                {resources.map(resource =>
                                    <ResourceGridItem>
                                        <ResourceCard
                                            headerAction={
                                                <IconButton
                                                    size="small"
                                                    onClick={e => handleMenuOpen(e, resource)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                            }
                                            resource={resource}
                                        />
                                    </ResourceGridItem>
                                )}
                            </ResourceGrid>
                        )
                    )
                )
            }
            </Box>
            <Menu
                id="resource-actions-menu"
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'resource-actions-menu',
                }}
            >
                <NavLink to={`/edit-file/${selectedResourceId}`} style={{color: "inherit", textDecoration: 'none'}}>
                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Редактировать</ListItemText>
                    </MenuItem>
                </NavLink>
                <NavLink to={`/edit-file/${selectedResourceId}`} style={{color: "inherit", textDecoration: 'none'}}>
                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <Delete color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText><Typography color="error">Удалить</Typography></ListItemText>
                    </MenuItem>
                </NavLink>
            </Menu>
        </div>
    );
};

export default ProfileResourcesList;