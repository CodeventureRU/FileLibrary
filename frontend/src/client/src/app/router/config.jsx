import {createBrowserRouter} from "react-router-dom";
import Layout from "../../pages/layout/index.js";
import Main from "../../pages/main/index.js";
import Profile from "../../pages/profile/index.js";
import UserProfile from "../../pages/user-profile/index.js";
import Login from "../../pages/login/index.js";
import Registration from "../../pages/registration/index.js";
import File from "../../pages/file/index.js";
import Group from "../../pages/group/index.js";
import {AuthGuard, GuestGuard, IsActiveGuard} from "../../features/auth-guards/index.js";
import {Activation} from "../../pages/activaion/index";
import {CreatingFile} from "../../pages/creating-file/index.js";
import {CreatingGroup} from "../../pages/creating-group/index.js";

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
                element: <AuthGuard><Profile/></AuthGuard>,
            },
            {
                path: "/creating-file",
                element: <AuthGuard><IsActiveGuard><CreatingFile/></IsActiveGuard></AuthGuard>,
            },
            {
                path: "/creating-group",
                element: <AuthGuard><IsActiveGuard><CreatingGroup/></IsActiveGuard></AuthGuard>,
            },
            {
                path: "/user/:username",
                element: <UserProfile />,
            },
            {
                path: "/login",
                element: <GuestGuard><Login/></GuestGuard>,
            },
            {
                path: "/register",
                element: <GuestGuard><Registration/></GuestGuard>,
            },
            {
                path: "/file/:resource",
                element: <File />,
            },
            {
                path: "/group/:resource",
                element: <Group/>,
            },
            {
                path: "/activation/:uidb64/:token",
                element: <Activation />,
            },
        ]
    },
]);