import React from 'react';
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";
import {useFetchMainResources} from "../../../entities/resource/index.js";
import {isAuthSelector, useViewerStore} from "../../../entities/viewer/index.js";

const MainResourcesList = () => {
    const isAuth = useViewerStore(isAuthSelector);
    const resourcesHook = useFetchMainResources();

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

export default MainResourcesList;