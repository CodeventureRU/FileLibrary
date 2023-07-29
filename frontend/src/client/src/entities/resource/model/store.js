import {create} from 'zustand';
import {immer} from "zustand/middleware/immer";

// Создаем store
const useResourcesStore = create()(immer((set) => ({
    // Начальное состояние
    resources: [],

    // Функция для установки resources
    setResources: (resources) => set(state => {
        state.resources = resources
    }),

    // Функция для добавления новых ресурсов
    addResources: (newResources) => set(state => {
        state.resources.push(...newResources)
    }),
})));

export { useResourcesStore };