const viewerSelector = state => state.viewer;
const setViewerSelector = state => state.setViewer;
const isAuthSelector = state => state.isAuth;
const setIsAuthSelector = state => state.setIsAuth;
const loginSelector = state => state.login;
const logoutSelector = state => state.logout;

export {viewerSelector, setViewerSelector, isAuthSelector, setIsAuthSelector, loginSelector, logoutSelector};