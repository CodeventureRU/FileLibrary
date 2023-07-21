import {createBrowserRouter} from "react-router-dom";
import Layout from "../../pages/layout/index.js";
import Main from "../../pages/main/index.js";
import Profile from "../../pages/profile/index.js";
import UserProfile from "../../pages/user-profile/index.js";
import Login from "../../pages/login/index.js";
import Registration from "../../pages/registration/index.js";
import File from "../../pages/file/index.js";
import Group from "../../pages/group/index.js";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Main/>,
            },
            {
                path: "/profile",
                element: <Profile/>,
            },
            {
                path: "/user/:username",
                element: <UserProfile />,
            },
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/register",
                element: <Registration/>,
            },
            {
                path: "/file/:resource",
                element: <File />,
            },
            {
                path: "/group/:resource",
                element: <Group/>,
            },
        ]
    },
]);