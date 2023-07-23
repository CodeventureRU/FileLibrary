import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import {Header} from "../../widgets/header/index";

const Layout = () => {
    const [isSidebarOpened, setIsSidebarOpened] = useState(false);
    return (
        <>
            <Header toggleMenu={() => setIsSidebarOpened(!isSidebarOpened)} />
            <Outlet />

        </>
    );
};

export default Layout;