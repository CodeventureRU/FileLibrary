import ResourcesViewSettings from "./ResourcesViewSettings.jsx";
import {useState} from "react";

// Кастомный хук для настроек фильтрации и сортировки
const useFilterSort = () => {
    const [sort, setSort] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');

    return { sort, setSort, sortDirection, setSortDirection, search, setSearch, type, setType };
};

// Кастомный хук для вида представления ресурсов
const useViewMode = () => {
    const [viewMode, setViewMode] = useState('list');

    return { viewMode, setViewMode };
};

export {ResourcesViewSettings, useFilterSort, useViewMode};