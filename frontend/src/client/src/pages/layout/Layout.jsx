import React, {useEffect, useState} from 'react';
import {Outlet} from "react-router-dom";
import {Header} from "../../widgets/header/index";
import {Box, CircularProgress, Container} from "@mui/material";
import {isAuthSelector, useVerify, useViewerStore} from "../../entities/viewer/index.js";

const Layout = () => {
    const [isSidebarOpened, setIsSidebarOpened] = useState(false);
    const {loading, verifyRequest} = useVerify();
    const isAuth = useViewerStore(isAuthSelector);

    useEffect(() => {
        if (isAuth) {
            verifyRequest();
        }
    }, [isAuth]);

    return (
        <>
            <Header toggleMenu={() => setIsSidebarOpened(!isSidebarOpened)} />
            <Container maxWidth="md">
                {
                loading
                    ?
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}} ><CircularProgress /></Box>
                    :
                    <Outlet />
                }
            </Container>
        </>
    );
};

export default Layout;