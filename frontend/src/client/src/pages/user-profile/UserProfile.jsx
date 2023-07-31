import React from 'react';
import {UserProfileHeader} from "../../widgets/user-profile-header/index.js";
import {UserProfileResources} from "../../widgets/user-profile-resources/index.js";

const UserProfile = () => {
    return (
        <div>
            <UserProfileHeader />
            <UserProfileResources />
        </div>
    );
};

export default UserProfile;