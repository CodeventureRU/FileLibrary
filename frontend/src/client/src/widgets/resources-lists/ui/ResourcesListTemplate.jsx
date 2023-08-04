import React, {useEffect} from 'react';
import {ResourcesViewSettings, useFilterSort, useViewMode} from "../../../features/resources-view-settings/index.js";
import {resourcesSelector, useResourcesStore} from "../../../entities/resource/index.js";
import {
    ResourceActionsMenu,
    ResourceHeaderAction,
    useResourceActionMenu
} from "../../../features/resource-actions-menu/index.js";
import ViewModeResourcesList from "../../../features/view-mode-resources-list/ViewModeResourcesList.jsx";
import {Divider} from "@mui/material";
import ResourceListItem from "../../../entities/resource/ui/ResourceListItem.jsx";
import ResourceFavorites from "../../../features/resource-favorites/ResourceFavorites.jsx";
import ResourceGridItem from "../../../entities/resource/ui/ResourceGridItem.jsx";
import ResourceCard from "../../../entities/resource/ui/ResourceCard.jsx";

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

    const {element, resource, close, open} = useResourceActionMenu();

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
                        <>
                            <Divider />
                            <ResourceListItem
                                headerActions={
                                    (showEditAction || (resource.type === 'file' && showAddToGroupAction)) ? (
                                        <ResourceHeaderAction resource={resource} open={open} />
                                    ) : ""
                                }
                                resource={resource}
                                mainActions={
                                    <>
                                        {
                                            showFavoriteAction ? (
                                                <ResourceFavorites resource={resource}></ResourceFavorites>
                                            ) : ""
                                        }
                                        {
                                            showDownloads ? (
                                                "загрузки"
                                            ) : ""
                                        }
                                    </>
                                }
                            />
                        </>
                    )
                }
                resourcesGrid={
                    resources.map(resource =>
                        <ResourceGridItem>
                            <ResourceCard
                                headerAction={
                                    (showEditAction || (resource.type === 'file' && showAddToGroupAction)) ? (
                                        <ResourceHeaderAction resource={resource} open={open} />
                                    ) : ""
                                }
                                resource={resource}
                            />
                        </ResourceGridItem>
                    )
                }
            />
            <ResourceActionsMenu
                resource={resource}
                element={element}
                close={close}
                editAction={showEditAction}
                deleteAction={showEditAction}
            />
        </div>
    );
};

export default ResourcesListTemplate;