import React from 'react';
import {useFetchUserResources} from "../../../entities/resource/index.js";
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";
import {useViewerStore, viewerSelector} from "../../../entities/viewer/index.js";

const PersonalResourcesList = () => {
    const viewer = useViewerStore(viewerSelector);
    const resourcesHook = useFetchUserResources(viewer.username);

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

export default PersonalResourcesList;