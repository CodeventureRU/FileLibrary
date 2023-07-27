import React, {lazy, Suspense, useRef, useState} from 'react';
import {Box, Button, ListItemIcon, Menu, MenuItem, Typography} from "@mui/material";
import {Add} from "@mui/icons-material";
import {NavLink} from "react-router-dom";

const CreateNewFolderIcon = lazy(() => import("@mui/icons-material/CreateNewFolder"));
const NoteAddIcon = lazy(() => import("@mui/icons-material/NoteAdd"));

const ArchiveHeader = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const menuRef = useRef();

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleOpen = () => {
        setAnchorEl(menuRef.current);
    }

    return (
        <>
            <Box sx={{display: 'flex', mt: 5, alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant="h6">Мой архив</Typography>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Button ref={menuRef} onClick={handleOpen} variant="contained" endIcon={
                        <Add />
                    }>Добавить</Button>
                </Box>

            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}

            >

                <NavLink to="/profile" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><NoteAddIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Файл
                    </MenuItem>
                </NavLink>

                <NavLink to="/profile" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><CreateNewFolderIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Группу
                    </MenuItem>
                </NavLink>
            </Menu>
        </>
    );
};

export default ArchiveHeader;