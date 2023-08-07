const resourcesSelector = state => state.resources;
const setResourcesSelector = state => state.setResources;
const addResourcesSelector = state => state.addResources;
const removeResourceSelector = state => state.removeResource;

export {resourcesSelector, setResourcesSelector, addResourcesSelector, removeResourceSelector};