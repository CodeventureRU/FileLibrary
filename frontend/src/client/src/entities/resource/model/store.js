import {create} from 'zustand';
import {immer} from "zustand/middleware/immer";

// Создаем store
const useResourcesStore = create()(immer((set) => ({
    // Начальное состояние
    resources: {},

    // Функция для установки resources
    setResources: (newViewer) => set(state => state.view = newViewer),

    // Функция для добавления новых ресурсов
    addResources: (newResources) => set(state => state.push(...newResources)),
})));

export { useResourcesStore };