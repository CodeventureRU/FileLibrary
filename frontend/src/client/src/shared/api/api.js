import axios from "axios";
import {useState} from "react";

export const API_URL = 'http://127.0.0.1:8000/api/v1';

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

export const useApi = (url, method) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const request = async (params, data={}) => {
        setLoading(true);
        setErrors([]);
        let res = null;

        try {
            switch(method) {
                case "get":
                    res = await $api.get(url, {params});
                    break;
                case "post":
                    res = await $api.post(url, data, {params});
                    break;
                case "put":
                    res = await $api.put(url, data, {params});
                    break;
                case "patch":
                    res = await $api.patch(url, data, {params});
                    break;
                case "delete":
                    res = await $api.delete(url, {params});
                    break;
            }
        } catch (e) {
            setErrors(e.data);
        } finally {
            setLoading(false);
        }

    }

    return {loading, errors, setErrors, request}
}

export const useAsyncApi = (url, method, params, data={}, auto=true) => {
    const {loading, errors, setErrors, request} = useApi(url, method);
    const [result, setResult] = null;
    const reload = () => {
        request(params, data).then(r => setResult(r));
    }

    if (auto) {
        reload();
    }

    return {loading, errors, setErrors, reload, result, request};
}

export default $api;