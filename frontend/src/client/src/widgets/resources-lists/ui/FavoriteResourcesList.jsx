import React from 'react';
import {useFetchFavoriteResources} from "../../../entities/resource/index.js";
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";

const FavoriteResourcesList = () => {
    const resourcesHook = useFetchFavoriteResources();

    return (
        <ResourcesListTemplate
            resourcesHook={resourcesHook}
            showEditAction={true}
            showAddToGroupAction={true}
            showFavoriteAction={true}
            showDownloads={true}
        />
    );
};

export default FavoriteResourcesList;