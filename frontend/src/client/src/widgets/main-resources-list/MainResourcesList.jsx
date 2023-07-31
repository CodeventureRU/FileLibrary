import React, {useEffect} from 'react';
import {ResourcesViewSettings, useFilterSort, useViewMode} from "../../features/resources-view-settings/index.js";
import {
    resourcesSelector,
    useFetchMainResources,
    useResourcesStore
} from "../../entities/resource/index.js";
import {
    ResourceActionsMenu,
    ResourceHeaderAction,
    useResourceActionMenu
} from "../../features/resource-actions-menu/index.js";
import ViewModeResourcesList from "../../features/view-mode-resources-list/ViewModeResourcesList.jsx";
import {Divider} from "@mui/material";
import ResourceListItem from "../../entities/resource/ui/ResourceListItem.jsx";
import ResourceGridItem from "../../entities/resource/ui/ResourceGridItem.jsx";
import ResourceCard from "../../entities/resource/ui/ResourceCard.jsx";

const MainResourcesList = () => {
    const filterAndSortObj = useFilterSort();
    const viewModeObj = useViewMode();
    const {loadMore, loading, errors, requested} = useFetchMainResources();
    const resources = useResourcesStore(resourcesSelector);

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
        loadMore({
            sort: filterAndSortObj.sort,
            search: filterAndSortObj.search,
            type: filterAndSortObj.type,
        }, {
            page: 1,
            limit: 100,
        }, true);
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
                                    resource.type === 'file' ? (
                                        <ResourceHeaderAction resource={resource} open={open} />
                                    ) : ""
                                }
                                resource={resource}
                            />
                        </>
                    )
                }
                resourcesGrid={
                    resources.map(resource =>
                        <ResourceGridItem>
                            <ResourceCard
                                headerAction={
                                    resource.type === 'file' ? (
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
                editAction={false}
                deleteAction={false}
            />
        </div>
    );
};

export default MainResourcesList;