import React from 'react';
import {useFetchUserResources} from "../../../entities/resource/index.js";
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";
import {useParams} from "react-router-dom";
import {isAuthSelector, useViewerStore} from "../../../entities/viewer/index.js";

const UserResourcesList = () => {
    const {username} = useParams();
    const isAuth = useViewerStore(isAuthSelector);
    const resourcesHook = useFetchUserResources(username);

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

export default UserResourcesList;