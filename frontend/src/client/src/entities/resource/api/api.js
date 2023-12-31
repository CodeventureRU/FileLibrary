import {useApi} from "../../../shared/api/index.js";
import {addResourcesSelector, setResourcesSelector, useResourcesStore} from "../model/index.js";
import {useCallback} from "react";

const URLS = {
    resource: id => `/resources/${id}/`,
    resources: `/resources/`,
    userResources: (username) => `/resources/user/${username}/`,
    favoriteResources: `/resources/favorites/`,
    toggleFavorite: id => `/resources/favorite/${id}/`,
    resourceFiles: id => `/resources/${id}/file/`,
    resourceGroups: id => `/resources/groups/${id}/`,
    resourceGroup: (id, group) => `/resources/${id}/group/${group}/`,
    groupResources: id => `/resources/group/${id}/`,
}

const useFetchResource = (id) => {
    const {request, ...apiHook} = useApi(URLS.resource(id), "get");

    return {...apiHook, fetchResourceRequest: request}
}

const useFetchResources = (url, handleResult=r=>r) => {
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
                type: (options?.type !== "all" ? options?.type : ""),
            }
        });


        if (result != null) {
            if (reset) {
                setResources(handleResult(result.results));
            } else {
                addResources(handleResult(result.results));
            }
        }

        return result;
    }, [url]);

    return {...apiHook, loadMore};
}

const useFetchMainResources = () => {
    return useFetchResources(URLS.resources);
}

const useFetchFavoriteResources = () => {
    return useFetchResources(URLS.favoriteResources, results => results.map(res => ({...res, is_favorite: true})));
}

const useFetchUserResources = (username) => {
    return useFetchResources(URLS.userResources(username));
}

const useFetchGroupResources = (group) => {
    return useFetchResources(URLS.groupResources(group));
}

const useUpdateResource = (id) => {
    const {request, ...apiHook} = useApi(URLS.resource(id), "patch");

    const updateRequest = async ({
        name,
        description,
        image,
        privacyLevel,
        tags
                                 }) => {

        let fd = new FormData();
        if (name !== undefined) {
            fd.append("name", name);
        }
        if (description !== undefined) {
            fd.append("description", description);
        }
        if (privacyLevel !== undefined) {
            fd.append("privacy_level", privacyLevel);
        }
        if (tags !== undefined) {
            fd.append("tags", tags);
        }
        if (image !== undefined) {
            fd.append("image", image);
        }

        return await request({
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }, fd);

    }

    return {...apiHook, updateRequest};
}

const useRemoveResourceFiles = (id) => {
    const {request, ...apiHook} = useApi(URLS.resourceFiles(id), "delete");

    const removeResourceFilesRequest = async ({extensions}) => {
        return await request({data: {extensions}}, {});
    }

    return {removeResourceFilesRequest, ...apiHook};
}

const useAddResourceFiles = (id) => {
    const {request, ...apiHook} = useApi(URLS.resourceFiles(id), "post");

    const addResourceFilesRequest = async ({files}) => {
        let fd = new FormData();

        if (files.length > 0) {
            files.forEach(f => {
                fd.append("files", f.file);
            });
        }

        return await request({
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }, fd);

    }

    return {addResourceFilesRequest, ...apiHook};
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
        tags,
        type,
        files=[],
                           }) => {

        let fd = new FormData();
        fd.append("type", type);
        fd.append("name", name);
        fd.append("description", description);
        fd.append("privacy_level", privacyLevel);
        fd.append("tags", tags);

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

const useRemoveResource = (id) => {
    const {request, ...apiHook} = useApi(URLS.resource(id), "delete");

    const removeResourceRequest = async () => {
        return await request({}, {});
    }

    return {...apiHook, removeResourceRequest}
}

const useFetchResourceGroups = (id) => {
    const {request, ...apiHook} = useApi(URLS.resourceGroups(id), "get");

    const fetchResourceGroupsRequest = async () => {
        return await request({}, {});
    }

    return {...apiHook, fetchResourceGroupsRequest}
}

const useAddResourceToGroup = (id, group) => {
    const {request, ...apiHook} = useApi(URLS.resourceGroup(id, group), "post");

    const addResourceToGroupRequest = async () => {
        return await request({}, {});
    }

    return {...apiHook, addResourceToGroupRequest}
}

const useRemoveResourceFromGroup = (id, group) => {
    const {request, ...apiHook} = useApi(URLS.resourceGroup(id, group), "delete");

    const removeResourceFromGroupRequest = async () => {
        return await request({}, {});
    }

    return {...apiHook, removeResourceFromGroupRequest}
}


export {
    useFetchResource,
    useFetchMainResources,
    useFetchUserResources,
    useFetchGroupResources,
    useUpdateResource,
    useCreateResource,
    useAddToFavorites,
    useRemoveFromFavorites,
    useFetchFavoriteResources,
    useAddResourceFiles,
    useRemoveResourceFiles,
    useRemoveResource,
    useFetchResourceGroups,
    useAddResourceToGroup,
    useRemoveResourceFromGroup
}