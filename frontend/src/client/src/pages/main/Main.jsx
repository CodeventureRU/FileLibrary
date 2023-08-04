import React from 'react';
import {MainResourcesList} from "../../widgets/resources-lists/index";
import {MainPageScreen} from "../../widgets/main-page-screen/index.js";

const Main = () => {
    return (
        <>
            <MainPageScreen />
            <MainResourcesList />
        </>
    );
};

export default Main;