import React from 'react';
import {useFetchGroupResources} from "../../../entities/resource/index.js";
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";

const GroupResourcesList = ({resource}) => {
    const resourcesHook = useFetchGroupResources(resource);

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

export default GroupResourcesList;