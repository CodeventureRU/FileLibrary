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
    resend: `/users/resend-account-activation/`,
    updateUsername: '/users/update-user-data/',
    updatePassword: '/users/update-user-data/',
    updateEmail: '/users/update-user-email/',
    sendResetPassword: "/users/send-reset-password/",
    resetPassword: (uidb64, token) => `/reset-password/${uidb64}/${token}/`,
    confirmEmail: (uidb64, token, email) => `/email-confirmation/${uidb64}/${email}/${token}/`,
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

const useUpdateUsername = () => {
    const {request, ...apiHook} = useApi(URLS.updateUsername, "patch");

    const updateUsernameRequest = async (username) => {
        return await request({}, {
            username
        });
    }

    return {...apiHook, updateUsernameRequest};
}

const useUpdateEmail = () => {
    const {request, ...apiHook} = useApi(URLS.updateEmail, "patch");

    const updateEmailRequest = async (email) => {
        return await request({}, {
            email
        });
    }

    return {...apiHook, updateEmailRequest};
}

const useUpdatePassword = () => {
    const {request, ...apiHook} = useApi(URLS.updatePassword, "patch");

    const updatePasswordRequest = async (currentPassword, password, passwordConfirm) => {
        return await request({}, {
            current_password: currentPassword,
            password: password,
            confirm_password: passwordConfirm,
        });
    }

    return {...apiHook, updatePasswordRequest};
}

const useSendResetPassword = () => {
    const {request, ...apiHook} = useApi(URLS.sendResetPassword, "post");

    const sendResetPasswordRequest = async (login) => {
        return await request({}, {
            login
        });
    }

    return {...apiHook, sendResetPasswordRequest};
}

const useResetPassword = (uidb64, token) => {
    const {request, ...apiHook} = useApi(URLS.resetPassword(uidb64, token), "post");

    const resetPasswordRequest = async (password, passwordConfirm) => {
        return await request({}, {
            password,
            confirm_password: passwordConfirm,
        });
    }

    return {...apiHook, resetPasswordRequest};
}

const useConfirmEmail = (uidb64, token, email) => {
    const {request, ...apiHook} = useApi(URLS.confirmEmail(uidb64, token, email), "post");

    const confirmEmailRequest = async (login, password) => {
        return await request({}, {
            login,
            password,
        });
    }

    return {...apiHook, confirmEmailRequest};
}

export {
    useLogin,
    useRegister,
    useLogout,
    useVerify,
    useActivate,
    useResendEmail,
    useUpdateUsername,
    useUpdateEmail,
    useUpdatePassword,
    useSendResetPassword,
    useResetPassword,
    useConfirmEmail
}