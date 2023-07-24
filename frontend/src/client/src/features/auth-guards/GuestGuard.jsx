import React from 'react';
import {isAuthSelector, useViewerStore} from "../../entities/viewer/index.js";
import {Navigate} from "react-router-dom";

const GuestGuard = ({children}) => {
    const isAuth = useViewerStore(isAuthSelector);

    if (isAuth) {
        return <Navigate to={"/profile"} />;
    }

    return <>{children}</>;
};

export default GuestGuard;