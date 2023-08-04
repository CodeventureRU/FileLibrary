import React from 'react';
import {useViewerStore, viewerSelector} from "../../entities/viewer/index.js";
import {ActivationWaiting} from "../../widgets/profile/activation-waiting/index.js";
import {ProfileData} from "../../widgets/profile/profile-data/index.js";
import {ArchiveHeader} from "../../widgets/profile/archive-header/index";
import {PersonalResourcesList} from "../../widgets/resources-lists/index.js";

const Profile = () => {
    const viewer = useViewerStore(viewerSelector);

    return (
        <div>
            <ProfileData />
            {!viewer.is_active
            ?
            <ActivationWaiting />
            :
            <>
                <ArchiveHeader />
                <PersonalResourcesList />
            </>
            }
        </div>
    );
};

export default Profile;