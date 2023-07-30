import {useApi} from "../../../shared/api/index.js";
import {
    loginSelector,
    logoutSelector,
    useViewerStore
} from "../model/index.js";

const URLS = {
    login: "/users/login/",
    register: "/users/registration/",
    logout: "/users/logout/",
    verify: "/users/verification/",
    activate: (uidb64, token) => `/activation/${uidb64}/${token}/`,
    resend: `/resent/`,
}

const useLogin = () => {
    const {request, ...apiHook} = useApi(URLS.login, "post");
    const loginFunc = useViewerStore(loginSelector); // Переименовал, чтобы не перебивалось с аргументом "login"

    const loginRequest = async (login, password) => {
        let res = await request({}, {
            login,
            password
        });
        if (res != null) {
            loginFunc(res);
        }
        return res;
    }

    return {...apiHook, loginRequest};
}

const useRegister = () => {
    const {request, ...apiHook} = useApi(URLS.register, "post");
    const login = useViewerStore(loginSelector);

    const registerRequest = async (email, username, password, passwordConfirm) => {
        let res = await request({}, {
            email,
            username,
            password,
            confirm_password: passwordConfirm
        });
        if (res != null) {
            login(res);
        }
        return res;
    }

    return {...apiHook, registerRequest};
}

const useLogout = () => {
    const {request, ...apiHook} = useApi(URLS.logout, "get");
    const logout = useViewerStore(logoutSelector);

    const logoutRequest = async () => {
        let res = await request({});
        if (res != null) {
            logout();
        }
        return res;
    }

    return {...apiHook, logoutRequest};
}

const useVerify = () => {
    const {request, ...apiHook} = useApi(URLS.verify, "post");
    const logout = useViewerStore(logoutSelector);
    const login = useViewerStore(loginSelector);

    const verifyRequest = async () => {
        let res = await request({});
        if (res == null) {
            logout();
        } else {
            login(res);
        }
        return res;
    }

    return {...apiHook, verifyRequest};
}

const useActivate = (uidb64, token) => {
    const {request, ...apiHook} = useApi(URLS.activate(uidb64, token), "get");

    const activateRequest = async () => {
        return await request({});
    }

    return {...apiHook, activateRequest};
}

const useResendEmail = () => {
    const {request, ...apiHook} = useApi(URLS.resend, "post");

    const resendRequest = async () => {
        return await request({});
    }

    return {...apiHook, resendRequest};
}

export {useLogin, useRegister, useLogout, useVerify, useActivate, useResendEmail}