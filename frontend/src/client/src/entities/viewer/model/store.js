import {create} from 'zustand';
import {immer} from "zustand/middleware/immer";
import {persist} from "zustand/middleware";

// Создаем store
const useViewerStore = create()(persist(immer((set, ) => ({
    // Начальное состояние
    viewer: {},
    isAuth: false,

    // Функции для установки viewer и isAuth
    setViewer: (newViewer) => set(state => state.viewer = newViewer),
    setIsAuth: (isAuthenticated) => set(state => state.isAuth = isAuthenticated),

    // Функции login и logout
    login: (newViewer) => set(state => {
        state.viewer = newViewer;
        state.isAuth = true;
    }),
    logout: () => set(state => {
        state.viewer = {};
        state.isAuth = false;
    }),
})), {
    name: "viewer-storage",
}));

export { useViewerStore};