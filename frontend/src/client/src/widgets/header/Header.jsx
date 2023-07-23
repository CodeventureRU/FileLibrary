import React, {lazy} from 'react';
import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";

const MenuIcon = lazy(() => import("@mui/icons-material/Menu"));

const Header = ({toggleMenu}) => {
    return (
        <AppBar position="sticky">
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon onClick={toggleMenu} />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                    FileLibrary
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;