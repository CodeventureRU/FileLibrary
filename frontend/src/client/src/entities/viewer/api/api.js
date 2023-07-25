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
}

const useLogin = () => {
    const {request, ...apiHook} = useApi(URLS.login, "post");
    const login = useViewerStore(loginSelector);

    const loginRequest = async (username, password) => {
        let res = await request({}, {
            username,
            password
        });
        if (res != null) {
            login(res);
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

export {useLogin, useRegister, useLogout, useVerify}