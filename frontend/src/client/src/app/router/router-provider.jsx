import React from 'react';
import {RouterProvider} from "react-router-dom";
import {router} from "./config.jsx";

const CustomRouterProvider = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default CustomRouterProvider;