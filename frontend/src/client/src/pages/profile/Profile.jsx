import React from 'react';
import {useViewerStore, viewerSelector} from "../../entities/viewer/index.js";
import {ActivationWaiting} from "../../widgets/activation-waiting/index.js";
import {ProfileData} from "../../widgets/profile-data/index.js";
import {ArchiveHeader} from "../../widgets/archive-header/index";

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
            </>
            }
        </div>
    );
};

export default Profile;