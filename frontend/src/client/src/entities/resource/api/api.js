import {useApi} from "../../../shared/api/index.js";
import {addResourcesSelector, setResourcesSelector, useResourcesStore} from "../model/index.js";
import {useCallback} from "react";

const URLS = {
    resource: id => `/resources/${id}/`,
    resources: `/resources/`,
    userResources: (username) => `/resources/user/${username}/`,
    toggleFavorite: id => `/resources/favorite/${id}/`,
}

const useFetchResource = (id) => {
    const {request, ...apiHook} = useApi(URLS.resource(id), "get");

    return {...apiHook, fetchResourceRequest: request}
}

const useFetchResources = (url) => {
    const {request, ...apiHook} = useApi(url, "get");
    const setResources = useResourcesStore(setResourcesSelector);
    const addResources = useResourcesStore(addResourcesSelector);

    const loadMore = useCallback(async (options, pagination, reset=false) => {
        let result = await request({
            params: {
                // Передача настройки пагинации
                page: pagination?.page,
                limit: pagination?.limit,

                // Передача настройки сортировки и фильтрации
                order_by: options?.sort,
                order_direction: options?.sortDirection,
                search: options?.search ? options?.search : "",
                type: options?.type,
            }
        });


        if (result != null) {
            if (reset) {
                setResources(result.results);
            } else {
                addResources(result.results);
            }
        }

        return result;
    }, [url]);

    return {...apiHook, loadMore};
}

const useFetchMainResources = () => {
    return useFetchResources(URLS.resources);
}

const useFetchMyResources = () => {
    return useFetchResources(URLS.resources);
}

const useFetchUserResources = (username) => {
    return useFetchResources(URLS.userResources(username));
}

const useUpdateResource = (id) => {
    return useApi(URLS.resource(id), "put");
}

const useAddToFavorites = (id) => {
    const {request, ...apiHook} = useApi(URLS.toggleFavorite(id), "post");

    const addToFavoritesRequest = async () => {
        return await request({}, {});
    }

    return {...apiHook, addToFavoritesRequest}
}

const useRemoveFromFavorites = (id) => {
    const {request, ...apiHook} = useApi(URLS.toggleFavorite(id), "delete");

    const removeFromFavoritesRequest = async () => {
        return await request({}, {});
    }

    return {...apiHook, removeFromFavoritesRequest}
}

const useCreateResource = () => {
    const {request, ...apiHook} = useApi(URLS.resources, "post");

    const createRequest = async ({
        name,
        description,
        image,
        privacyLevel,
        type,
        files=[],
                           }) => {

        let fd = new FormData();
        fd.append("type", type);
        fd.append("name", name);
        fd.append("description", description);
        fd.append("privacy_level", privacyLevel);

        if (image !== null) {
            fd.append("image", image);
        }

        if (files.length > 0) {
            files.forEach(f => {
                console.log(f.file);
                fd.append("files", f.file);
            });
        }

        return await request({
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }, fd);

    }

    return {...apiHook, createRequest};
}



export {
    useFetchResource,
    useFetchMainResources,
    useFetchUserResources,
    useFetchMyResources,
    useUpdateResource,
    useCreateResource,
    useAddToFavorites,
    useRemoveFromFavorites,
}