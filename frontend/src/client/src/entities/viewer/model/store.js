import {create} from 'zustand';
import {immer} from "zustand/middleware/immer";

// Создаем store
const useViewerStore = create()(immer((set) => ({
    // Начальное состояние
    viewer: {},
    isAuth: false,

    // Функции для установки viewer и isAuth
    setViewer: (newViewer) => set(state => state.view = newViewer),
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
})));

export { useViewerStore};