import axios from "axios";
import {useState} from "react";

export const API_URL = 'http://localhost:8000/api/v1';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.response.use(
    (config) => {
        return config;
    },async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.config && !error.config._isRetry) {
            originalRequest._isRetry = true;
            try {
                await axios.post(`${API_URL}/users/verification/`, {withCredentials: true});
                return $api.request(originalRequest);
            } catch (e) {

            }
        }
    throw error;
})

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start !== -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

const setCsrf = () => {
    let csrf = getCookie('csrftoken');
    if (csrf) {
        $api.defaults.headers['X-CSRFTOKEN'] = csrf;
    }
}
setCsrf();

export const useApi = (url, method) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [requested, setRequested] = useState(0);

    const request = async (params, data={}) => {
        setLoading(true);
        setErrors({});
        let res = null;

        try {
            switch(method) {
                case "get":
                    res = await $api.get(url, {...params});
                    res = res.data;
                    break;
                case "post":
                    res = await $api.post(url, data, {...params});
                    res = res.data;
                    break;
                case "put":
                    res = await $api.put(url, data, {...params});
                    res = res.data;
                    break;
                case "patch":
                    res = await $api.patch(url, data, {...params});
                    res = res.data;
                    break;
                case "delete":
                    res = await $api.delete(url, {...params});
                    res = res.data;
                    break;
            }
            setCsrf(res);
        } catch (e) {
            if (e?.response?.data) {
                setErrors(e.response.data);
            } else {
                setErrors({detail: e.message});
            }

        } finally {
            setLoading(false);
            setRequested(requested + 1);
        }

        return res;

    }

    return {loading, errors, setErrors, request, requested}
}

export const useAsyncApi = (url, method, params, data={}, auto=true) => {
    const {loading, errors, setErrors, request} = useApi(url, method);
    const [result, setResult] = useState(null);
    const reload = () => {
        request(params, data).then(r => setResult(r));
    }

    if (auto) {
        reload();
    }

    return {loading, errors, setErrors, reload, result, request};
}

export default $api;