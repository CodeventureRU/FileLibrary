import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import {Header} from "../../widgets/header/index";
import {Container} from "@mui/material";

const Layout = () => {
    const [isSidebarOpened, setIsSidebarOpened] = useState(false);
    return (
        <>
            <Header toggleMenu={() => setIsSidebarOpened(!isSidebarOpened)} />
            <Container maxWidth="md"><Outlet /></Container>
        </>
    );
};

export default Layout;