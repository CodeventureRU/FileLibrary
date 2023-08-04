import React from 'react';
import {UserProfileHeader} from "../../widgets/user-profile-header/index.js";
import {UserResourcesList} from "../../widgets/resources-lists/index.js";

const UserProfile = () => {
    return (
        <div>
            <UserProfileHeader />
            <UserResourcesList />
        </div>
    );
};

export default UserProfile;