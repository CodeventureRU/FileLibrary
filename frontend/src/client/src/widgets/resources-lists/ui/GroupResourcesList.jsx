import React from 'react';
import {useFetchGroupResources} from "../../../entities/resource/index.js";
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";
import {isAuthSelector, useViewerStore} from "../../../entities/viewer/index.js";

const GroupResourcesList = ({resource}) => {
    const isAuth = useViewerStore(isAuthSelector);
    const resourcesHook = useFetchGroupResources(resource);

    return (
        <ResourcesListTemplate
            resourcesHook={resourcesHook}
            showEditAction={false}
            showAddToGroupAction={isAuth}
            showFavoriteAction={true}
            showDownloads={true}
        />
    );
};

export default GroupResourcesList;