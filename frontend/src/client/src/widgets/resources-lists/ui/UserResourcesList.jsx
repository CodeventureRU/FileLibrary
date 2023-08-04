import React from 'react';
import {useFetchUserResources} from "../../../entities/resource/index.js";
import ResourcesListTemplate from "./ResourcesListTemplate.jsx";
import {useParams} from "react-router-dom";

const UserResourcesList = () => {
    const {username} = useParams();
    const resourcesHook = useFetchUserResources(username);

    return (
        <ResourcesListTemplate
            resourcesHook={resourcesHook}
            showEditAction={false}
            showAddToGroupAction={true}
            showFavoriteAction={true}
        />
    );
};

export default UserResourcesList;