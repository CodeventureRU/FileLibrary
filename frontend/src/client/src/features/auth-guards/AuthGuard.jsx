import React from 'react';
import {isAuthSelector, useViewerStore} from "../../entities/viewer/index.js";
import {Navigate} from "react-router-dom";

const AuthGuard = ({children}) => {
    const isAuth = useViewerStore(isAuthSelector);

    if (!isAuth) {
        return <Navigate to={"/login"} />;
    }

    return <>{children}</>;
};

export default AuthGuard;