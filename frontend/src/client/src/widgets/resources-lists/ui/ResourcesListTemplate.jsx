import React, {useEffect, useState} from 'react';
import {ResourcesViewSettings, useFilterSort, useViewMode} from "../../../features/resources-view-settings/index.js";
import {resourcesSelector, useResourcesStore} from "../../../entities/resource/index.js";
import {
    ResourceActionsMenu,
    ResourceHeaderAction,
    useResourceActionMenu
} from "../../../features/resource-actions-menu/index.js";
import ViewModeResourcesList from "../../../features/view-mode-resources-list/ViewModeResourcesList.jsx";
import {Box, Divider, Typography} from "@mui/material";
import ResourceListItem from "../../../entities/resource/ui/ResourceListItem.jsx";
import ResourceFavorites from "../../../features/resource-favorites/ResourceFavorites.jsx";
import ResourceGridItem from "../../../entities/resource/ui/ResourceGridItem.jsx";
import ResourceCard from "../../../entities/resource/ui/ResourceCard.jsx";
import {ResourceDownloads} from "../../../features/resource-downloads/index.js";
import {ResourcesStandardPagination} from "../../../features/resources-pagination/index.js";

const STANDARD_LIMIT = 6;

const ResourcesListTemplate = ({
   showEditAction=false,
   showAddToGroupAction=false,
   showFavoriteAction=false,
   showDownloads=false,
   resourcesHook,
                               }) => {
    const filterAndSortObj = useFilterSort();
    const viewModeObj = useViewMode();
    const {loadMore, loading, errors, requested} = resourcesHook;
    const resources = useResourcesStore(resourcesSelector);
    const [numPages, setNumPages] = useState(1);

    const reset = async () => {
        let res = await loadMore(filterAndSortObj, {
            page: 1,
            limit: STANDARD_LIMIT,
        }, true);
        setNumPages(res.num_pages);
    }

    useEffect(() => {
        reset();
    }, []);

    // Применение фильтров
    const apply = () => {
        reset();
    }

    // Данные всплювающих меню
    const {element: resourceActionsMenuAnchor, resource: resourceActionsMenuData, close: closeResourceActionsMenu, open: openResourceActionsMenu} = useResourceActionMenu();

    return (
        <div>
            <ResourcesViewSettings
                filterAndSortObj={filterAndSortObj}
                viewModeObj={viewModeObj}
                apply={apply}
            />
            <ViewModeResourcesList
                loading={loading}
                requested={requested}
                errors={errors}
                viewModeObj={viewModeObj}
                resourcesList={
                    resources.length ?
                    resources.map(resource =>
                        <React.Fragment key={resource.slug}>
                            <Divider />
                            <ResourceListItem
                                headerActions={
                                    <>
                                        {
                                            (showEditAction || (resource.type === 'file' && showAddToGroupAction)) ? (
                                                <ResourceHeaderAction resource={resource} open={openResourceActionsMenu} />
                                            ) : ""
                                        }

                                    </>

                                }
                                resource={resource}
                                mainActions={
                                    <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                                        {
                                            showDownloads && resource.type === "file" ? (
                                                <ResourceDownloads resource={resource}></ResourceDownloads>
                                            ) : ""
                                        }
                                        {
                                            showFavoriteAction ? (
                                                <ResourceFavorites resource={resource}></ResourceFavorites>
                                            ) : ""
                                        }
                                    </Box>
                                }
                            />
                        </React.Fragment>
                    ) : (
                            <Typography variant="body1">Нет ресурсов</Typography>
                    )
                }
                resourcesGrid={
                    resources.map(resource =>
                        <ResourceGridItem key={resource.slug}>
                            <ResourceCard
                                headerAction={
                                    (showEditAction || (resource.type === 'file' && showAddToGroupAction)) ? (
                                        <ResourceHeaderAction resource={resource} open={openResourceActionsMenu} />
                                    ) : ""
                                }
                                resource={resource}
                                mainActions={
                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: "space-between", gap: 1}}>
                                        {
                                            showFavoriteAction ? (
                                                <ResourceFavorites reverse={true} resource={resource}></ResourceFavorites>
                                            ) : ""
                                        }
                                        {
                                            showDownloads && resource.type === "file" ? (
                                                <ResourceDownloads reverse={true} resource={resource}></ResourceDownloads>
                                            ) : ""
                                        }
                                    </Box>
                                }
                            />
                        </ResourceGridItem>
                    )
                }
            />
            <ResourcesStandardPagination filterAndSortObj={filterAndSortObj} loadMore={loadMore} numPages={numPages} limit={STANDARD_LIMIT}></ResourcesStandardPagination>
            <ResourceActionsMenu
                resource={resourceActionsMenuData}
                element={resourceActionsMenuAnchor}
                close={closeResourceActionsMenu}
                editAction={showEditAction}
                deleteAction={showEditAction}
            />
        </div>
    );
};

export default ResourcesListTemplate;