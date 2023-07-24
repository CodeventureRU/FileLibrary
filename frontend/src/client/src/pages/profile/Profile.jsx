import React from 'react';
import {useViewerStore, viewerSelector} from "../../entities/viewer/index.js";
import {ActivationWaiting} from "../../widgets/activation-waiting/index.js";

const Profile = () => {
    const viewer = useViewerStore(viewerSelector);

    return (
        <div>
            {!viewer.is_active
            ?
            <ActivationWaiting />
            :
                <>Пользователь подтвердил почту</>
            }
        </div>
    );
};

export default Profile;