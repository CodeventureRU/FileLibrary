import React from 'react';
import {
    Box, Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import {
    AppRegistration,
    Close, Favorite,
    Home,
    InsertDriveFile,
    LoginOutlined,
    Logout,
    Menu
} from "@mui/icons-material";

const Sidebar = ({isSidebarOpened, setIsSidebarOpened}) => {
    return (
        <Drawer
            anchor="left"
            open={isSidebarOpened}
            onClose={() => setIsSidebarOpened(false)}
        >
            <Box
                sx={{width: {xs: '100vw', sm: 250}}}
            >
                <List>
                    <ListItem disablePadding secondaryAction={
                        <IconButton onClick={() => setIsSidebarOpened(false)}>
                            <Close />
                        </IconButton>
                    }>
                        <ListItemButton>
                            <ListItemIcon>
                                <Menu />
                            </ListItemIcon>
                            <ListItemText primary={"Меню"} />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>
                            <ListItemText primary="Главная" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Favorite />
                            </ListItemIcon>
                            <ListItemText primary="Избранное" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <InsertDriveFile />
                            </ListItemIcon>
                            <ListItemText primary="Мои файлы" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary="Выйти" />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <LoginOutlined />
                            </ListItemIcon>
                            <ListItemText primary="Войти" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <AppRegistration />
                            </ListItemIcon>
                            <ListItemText primary="Зарегистрироваться" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>

        </Drawer>
    );
};

export default Sidebar;