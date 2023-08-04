import React from 'react';
import {Box, Paper, Tab, Tabs, Typography} from "@mui/material";
import {UsernameForm} from "../../../features/profile-settings/username-form/index.js";
import {EmailForm} from "../../../features/profile-settings/email-form/index.js";
import {PasswordForm} from "../../../features/profile-settings/password-form/index.js";
import {AccountDeletion} from "../../../features/profile-settings/account-deletion/index.js";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            style={{width: "100%"}}
        >
            {value === index && (
                <Box sx={{ py: {md: 1, xs: 3}, px: {md: 3, xs: 0} }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index, orientation="vertical") {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
        sx: {
            flexDirection: "row",
            justifyContent: orientation === "vertical" ? "flex-start" : "center",
            textAlign: orientation === "vertical" ? "left" : "center",
            textTransform: 'none',
        }
    };
}

const AccountSettings = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{mt: 5}}>
                <Typography variant="h6">Настройки учетной записи</Typography>
                <Paper variant="outlined" sx={{p: 3, mt: 2}}>

                    <Box sx={{display: {md: "none", xs: "block"}}}>
                        <Tabs
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            scrollButtons
                            allowScrollButtonsMobile
                        >
                            <Tab label="Имя пользователя" {...a11yProps(1, "horizontal")} />
                            <Tab label="Email" {...a11yProps(0, "horizontal")} />
                            <Tab label="Пароль" {...a11yProps(2, "horizontal")} />
                            <Tab label="Удаление аккаунта" {...a11yProps(3, "horizontal")} />
                        </Tabs>
                    </Box>
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
                    >
                        <Box sx={{display: {md: "block", xs: "none"}}}>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={value}
                                onChange={handleChange}
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                            >
                                <Tab label="Имя пользователя" {...a11yProps(1)} />
                                <Tab label="Email" {...a11yProps(0)} />
                                <Tab label="Пароль" {...a11yProps(2)} />
                                <Tab label="Удаление аккаунта" {...a11yProps(3)} />
                            </Tabs>
                        </Box>

                        <TabPanel value={value} index={0}>
                            <Typography>Редактирование имени пользователя</Typography>
                            <UsernameForm />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Typography>Редактирование Email</Typography>
                            <EmailForm />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Typography>Редактирование пароля</Typography>
                            <PasswordForm />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <Typography>Удаление аккаунта</Typography>
                            <AccountDeletion />
                        </TabPanel>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
};

export default AccountSettings;