import React, {useEffect} from 'react';
import {ResourcesViewSettings, useFilterSort, useViewMode} from "../../../features/resources-view-settings/index.js";
import {resourcesSelector, useResourcesStore} from "../../../entities/resource/index.js";
import {
    ResourceActionsMenu,
    ResourceHeaderAction,
    useResourceActionMenu
} from "../../../features/resource-actions-menu/index.js";
import ViewModeResourcesList from "../../../features/view-mode-resources-list/ViewModeResourcesList.jsx";
import {Box, Divider} from "@mui/material";
import ResourceListItem from "../../../entities/resource/ui/ResourceListItem.jsx";
import ResourceFavorites from "../../../features/resource-favorites/ResourceFavorites.jsx";
import ResourceGridItem from "../../../entities/resource/ui/ResourceGridItem.jsx";
import ResourceCard from "../../../entities/resource/ui/ResourceCard.jsx";
import {ResourceDownloads, useResourceDownloadsMenu} from "../../../features/resource-downloads/index.js";
import ResourceDownloadsMenu from "../../../features/resource-downloads/ResourceDownloadsMenu.jsx";

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

    const reset = () => {
        loadMore({
            sort: filterAndSortObj.sort,
            search: filterAndSortObj.search,
            type: filterAndSortObj.type,
        }, {
            page: 1,
            limit: 3,
        }, true);
    }

    useEffect(() => {
        reset();
    }, []);

    const apply = () => {
        reset();
    }

    const {element: resourceActionsMenuAnchor, resource: resourceActionsMenuData, close: closeResourceActionsMenu, open: openResourceActionsMenu} = useResourceActionMenu();
    const {element: resourceDownloadsMenuAnchor, resource: resourceDownloadsMenuData, close: closeResourceDownloadsMenu, open: openResourceDownloadsMenu} = useResourceDownloadsMenu();

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
                                                <ResourceDownloads resource={resource} open={openResourceDownloadsMenu}></ResourceDownloads>
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
                                                <ResourceDownloads reverse={true} resource={resource} open={openResourceDownloadsMenu}></ResourceDownloads>
                                            ) : ""
                                        }
                                    </Box>
                                }
                            />
                        </ResourceGridItem>
                    )
                }
            />
            <ResourceActionsMenu
                resource={resourceActionsMenuData}
                element={resourceActionsMenuAnchor}
                close={closeResourceActionsMenu}
                editAction={showEditAction}
                deleteAction={showEditAction}
            />
            <ResourceDownloadsMenu
                resource={resourceDownloadsMenuData}
                element={resourceDownloadsMenuAnchor}
                close={closeResourceDownloadsMenu}
            />
        </div>
    );
};

export default ResourcesListTemplate;