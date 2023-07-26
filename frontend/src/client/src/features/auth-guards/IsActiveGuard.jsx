import React from 'react';
import {useViewerStore, viewerSelector} from "../../entities/viewer/index.js";
import {Navigate} from "react-router-dom";

const IsActiveGuard = ({children}) => {
    const viewer = useViewerStore(viewerSelector);

    if (!viewer.is_active) {
        return <Navigate to={"/profile"} />;
    }

    return <>{children}</>;
};

export default IsActiveGuard;