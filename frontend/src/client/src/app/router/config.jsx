import {createBrowserRouter} from "react-router-dom";
import Layout from "../../pages/layout/index.js";
import Main from "../../pages/main/index.js";
import Profile from "../../pages/profile/index.js";
import UserProfile from "../../pages/user-profile/index.js";
import Login from "../../pages/login/index.js";
import Registration from "../../pages/registration/index.js";
import Resource from "../../pages/resource/index.js";
import {AuthGuard, GuestGuard, IsActiveGuard} from "../../features/auth-guards/index.js";
import {Activation} from "../../pages/activaion/index";
import {CreatingFile} from "../../pages/creating-file/index.js";
import {CreatingGroup} from "../../pages/creating-group/index.js";
import {ProfileSettings} from "../../pages/profile-settings/index.js";
import {SendResetPassword} from "../../pages/send-reset-password/index.js";
import {ResetPassword} from "../../pages/reset-password/index.js";
import {ConfirmEmail} from "../../pages/confirm-email/index.js";
import {Favorites} from "../../pages/favorites/index.js";
import {EditingFile} from "../../pages/editing-file/index.js";
import {EditingGroup} from "../../pages/editing-group/index.js";

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
                path: "/profile/favorites",
                element: <AuthGuard><IsActiveGuard><Favorites/></IsActiveGuard></AuthGuard>,
            },
            {
                path: "/profile/settings",
                element: <AuthGuard><ProfileSettings/></AuthGuard>,
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
                path: "/editing-file/:resource",
                element: <AuthGuard><IsActiveGuard><EditingFile/></IsActiveGuard></AuthGuard>,
            },
            {
                path: "/editing-group/:resource",
                element: <AuthGuard><IsActiveGuard><EditingGroup/></IsActiveGuard></AuthGuard>,
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
                path: "/send-reset-password",
                element: <GuestGuard><SendResetPassword/></GuestGuard>,
            },
            {
                path: "/register",
                element: <GuestGuard><Registration/></GuestGuard>,
            },
            {
                path: "/resource/:resource",
                element: <Resource />,
            },
            {
                path: "/activation/:uidb64/:token",
                element: <Activation />,
            },
            {
                path: "/reset-password/:uidb64/:token",
                element: <GuestGuard><ResetPassword/></GuestGuard>,
            },
            {
                path: "/email-confirmation/:uidb64/:email/:token",
                element: <ConfirmEmail/>,
            },
        ]
    },
]);