import React from 'react';
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";
import {useFetchMainResources} from "../../../entities/resource/index.js";

const MainResourcesList = () => {
    const resourcesHook = useFetchMainResources();

    return (
        <ResourcesListTemplate
            resourcesHook={resourcesHook}
            showEditAction={false}
            showAddToGroupAction={true}
            showFavoriteAction={true}
            showDownloads={true}
        />
    );
};

export default MainResourcesList;