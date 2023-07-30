import {useAsyncApi, useApi} from "../../../shared/api/index.js";
import {addResourcesSelector, setResourcesSelector, useResourcesStore} from "../model/index.js";
import {useCallback} from "react";

const URLS = {
    resource: id => `/resources/${id}/`,
    resources: `/resources/`,
    myResources: `/my/resources/`,
    userResources: (id) => `/user/${id}/resources/`,

}

const useFetchedResource = (id) => {
    return useAsyncApi(URLS.resource(id), "get", {});
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
                sort: options?.sort,
                search: options?.search ? options?.search : "",
                type: options?.type,
            }
        });

        if (result != null) {
            if (reset) {
                setResources(result);
            } else {
                addResources(result);
            }
        }
    }, [url]);

    return {...apiHook, loadMore};
}

const useFetchMainResources = () => {
    return useFetchResources(URLS.resources);
}

const useFetchMyResources = () => {
    return useFetchResources(URLS.resources);
}

const useFetchUserResources = (userId) => {
    return useFetchResources(URLS.resources);
}

const useUpdateResource = (id) => {
    return useApi(URLS.resource(id), "put");
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



export {useFetchedResource, useFetchMainResources, useFetchUserResources, useFetchMyResources, useUpdateResource, useCreateResource}