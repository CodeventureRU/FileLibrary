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

            // Передача настройки пагинации
            page: pagination?.page,
            limit: pagination?.limit,

            // Передача настройки сортировки и фильтрации
            sort: options?.filter?.sort,
            search: options?.filter?.search ? options?.filter?.search : "",
            type: options?.filter?.type,

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
    return useFetchResources(URLS.myResources);
}

const useFetchUserResources = (userId) => {
    return useFetchResources(URLS.userResources(userId));
}

const useUpdateResource = (id) => {
    return useApi(URLS.resource(id), "put");
}

export {useFetchedResource, useFetchMainResources, useFetchUserResources, useFetchMyResources, useUpdateResource}