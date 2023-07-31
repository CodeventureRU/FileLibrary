import React, { useState } from 'react';
import {
    ViewModule,
    Reorder,
    Tune,
    SwapVert,
} from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Box,
    IconButton,
} from '@mui/material';

const ResourcesViewSettings = ({filterAndSortObj, viewModeObj, apply}) => {
    const { sort, setSort, sortDirection, setSortDirection, search, setSearch, type, setType } = filterAndSortObj;
    const { viewMode, setViewMode } = viewModeObj;
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
    };

    const handleFilterModalClose = () => {
        setIsFilterModalOpen(false);
    };

    const handleSortModalOpen = () => {
        setIsSortModalOpen(true);
    };

    const handleSortModalClose = () => {
        setIsSortModalOpen(false);
    };

    const handleApplyFilter = () => {
        setIsFilterModalOpen(false);
        apply();
    };

    return (
        <div>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton color="primary"><Tune onClick={handleFilterModalOpen} /></IconButton>
                    <IconButton color="primary"><SwapVert onClick={handleSortModalOpen} /></IconButton>
                    <TextField
                        label="Поиск"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                    <Button onClick={handleApplyFilter} variant="contained" color="primary">
                        Применить
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ToggleButtonGroup size="small" value={viewMode} exclusive onChange={(e, value) => setViewMode(value)}>
                        <ToggleButton value="list" color="primary">
                            <Reorder />
                        </ToggleButton>
                        <ToggleButton value="cards" color="primary">
                            <ViewModule />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {/* Модальное окно для настройки фильтра */}
            <Dialog fullWidth={true} maxWidth={"sm"} open={isFilterModalOpen} onClose={handleFilterModalClose}>
                <DialogTitle>Настройка фильтра</DialogTitle>
                <DialogContent>
                    <Select fullWidth={true} value={type} onChange={(e) => setType(e.target.value)}>
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="files">Файлы</MenuItem>
                        <MenuItem value="groups">Группы</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterModalClose} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно для настройки сортировки */}
            <Dialog fullWidth={true} maxWidth={"sm"} open={isSortModalOpen} onClose={handleSortModalClose}>
                <DialogTitle>Настройка сортировки</DialogTitle>
                <DialogContent>
                    <Select fullWidth={true} value={sort} onChange={(e) => setSort(e.target.value)}>
                        <MenuItem value="name">По названию</MenuItem>
                        <MenuItem value="created_at">По дате</MenuItem>
                        <MenuItem value="favorites">По количеству добавлений в избранное</MenuItem>
                    </Select>
                    <RadioGroup
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <FormControlLabel value="asc" control={<Radio />} label="По возрастанию" />
                        <FormControlLabel value="desc" control={<Radio />} label="По убыванию" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSortModalClose} color="primary">
                        Закрыть
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ResourcesViewSettings;