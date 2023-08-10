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
import {NavLink, useNavigate} from "react-router-dom";
import {
    isAuthSelector,
    useLogout,
    useViewerStore,
    viewerSelector
} from "../../entities/viewer/index.js";

const AccountCircleIcon = lazy(() => import("@mui/icons-material/AccountCircle"));
const CreateNewFolderIcon = lazy(() => import("@mui/icons-material/CreateNewFolder"));
const ExpandMoreIcon = lazy(() => import("@mui/icons-material/ExpandMore"));
const FavoriteIcon = lazy(() => import("@mui/icons-material/Favorite"));
const NoteAddIcon = lazy(() => import("@mui/icons-material/NoteAdd"));
const PersonIcon = lazy(() => import("@mui/icons-material/Person"));
const LogoutIcon = lazy(() => import("@mui/icons-material/Logout"));

const Header = () => {
    const viewer = useViewerStore(viewerSelector);
    const isAuth = useViewerStore(isAuthSelector);
    // const logout = useViewerStore(logoutSelector);
    const {logoutRequest} = useLogout();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const menuRef = useRef();
    const navigate = useNavigate();

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleOpen = () => {
        setAnchorEl(menuRef.current);
    }

    const handleLogout = () => {
        logoutRequest().then(() => {
            navigate("/login");
        });
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
                            {
                                isAuth ?
                                    <Button
                                        sx={{py: 1, px: 2, borderRadius: 200, textTransform: 'none'}}
                                        color="inherit"
                                        endIcon={<Suspense fallback=""><ExpandMoreIcon /></Suspense>}
                                        startIcon={<Suspense fallback=""><AccountCircleIcon /></Suspense>}
                                        onClick={handleOpen}
                                        ref={menuRef}
                                    >
                                        {viewer.username}
                                    </Button>
                                    :
                                    <>
                                        <NavLink to={"/login"} style={{textDecoration: 'none', color: 'inherit'}}><Button color="inherit">Войти</Button></NavLink>
                                        <NavLink to={"/register"} style={{textDecoration: 'none', color: 'inherit'}}><Button color="inherit">Зарегистрироваться</Button></NavLink>
                                    </>
                            }

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

                <NavLink to="/profile/favorites" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><FavoriteIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Избранное
                    </MenuItem>
                </NavLink>
                <Divider />

                <NavLink to="/creating-file" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><NoteAddIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Загрузить файл
                    </MenuItem>
                </NavLink>

                <NavLink to="/creating-group" style={{textDecoration: 'none', color: 'inherit'}}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Suspense fallback=""><CreateNewFolderIcon fontSize="small" /></Suspense>
                        </ListItemIcon>
                        Создать группу
                    </MenuItem>
                </NavLink>
                <Divider />
                <MenuItem sx={{color: theme => theme.palette.error.main}} onClick={() => {
                    handleClose();
                    handleLogout();
                }}>
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