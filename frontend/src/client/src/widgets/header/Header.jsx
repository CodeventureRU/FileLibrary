import React, {lazy, Suspense, useRef, useState} from 'react';
import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    ListItemIcon, Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {NavLink} from "react-router-dom";

const AccountCircleIcon = lazy(() => import("@mui/icons-material/AccountCircle"));
const CreateNewFolderIcon = lazy(() => import("@mui/icons-material/CreateNewFolder"));
const ExpandMoreIcon = lazy(() => import("@mui/icons-material/ExpandMore"));
const FavoriteIcon = lazy(() => import("@mui/icons-material/Favorite"));
const NoteAddIcon = lazy(() => import("@mui/icons-material/NoteAdd"));
const PersonIcon = lazy(() => import("@mui/icons-material/Person"));
const LogoutIcon = lazy(() => import("@mui/icons-material/Logout"));

const Header = () => {
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
            <AppBar position="sticky">
                <Container maxWidth="md">
                    <Toolbar variant="dense">
                        <Typography variant="h6" color="inherit" component="div">

                            <NavLink to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                                FileLibrary
                            </NavLink>
                        </Typography>
                        <Box
                            sx={{flexGrow: 1}}
                        />
                        <Box
                            sx={{display: 'flex', alignItems: 'center'}}
                        >
                            <Button
                                sx={{py: 1, px: 2, borderRadius: 200, textTransform: 'none'}}
                                color="inherit"
                                endIcon={<Suspense fallback=""><ExpandMoreIcon /></Suspense>}
                                startIcon={<Suspense fallback=""><AccountCircleIcon /></Suspense>}
                                onClick={handleOpen}
                                ref={menuRef}
                            >
                                Username
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>

            </AppBar>
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
                            <Suspense fallback=""><PersonIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Личный кабинет
                    </MenuItem>
                </NavLink>

                <NavLink to="/profile" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><FavoriteIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Избранное
                    </MenuItem>
                </NavLink>
                <Divider />

                <NavLink to="/profile" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><NoteAddIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Загрузить файл
                    </MenuItem>
                </NavLink>

                <NavLink to="/profile" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><CreateNewFolderIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Создать группу
                    </MenuItem>
                </NavLink>
                <Divider />
                <MenuItem sx={{color: theme => theme.palette.error.main}} onClick={handleClose}>
                    <ListItemIcon>
                        <Suspense fallback=""><LogoutIcon color="error" fontSize="small" /></Suspense>
                    </ListItemIcon>
                    Выйти
                </MenuItem>
            </Menu>
        </>
    );
};

export default Header;