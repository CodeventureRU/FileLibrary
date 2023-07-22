import {useAsyncApi} from "../../../shared/api/index.js";

const URLS = {
    user: username => `/users/${username}/`,
}

const useFetchedUser = (username) => {
    return useAsyncApi(URLS.user(username), "get", {});
}

export {useFetchedUser}