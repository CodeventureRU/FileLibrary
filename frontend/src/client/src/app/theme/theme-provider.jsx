import React from 'react';
import {ThemeProvider} from "@mui/material";
import {theme} from "./config.js";

const CustomThemeProvider = ({children}) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};

export default CustomThemeProvider;