import React from 'react';
import {Box, Paper, Tab, Tabs, Typography} from "@mui/material";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 1, px: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
        sx: {

            flexDirection: "row",
            justifyContent: "flex-start",
            textTransform: 'none'
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
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
                    >
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Имя пользователя" {...a11yProps(1)} />
                            <Tab label="Email" {...a11yProps(0)} />
                            <Tab label="Пароль" {...a11yProps(2)} />
                            <Tab label="Удаление аккаунта" {...a11yProps(3)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Typography>Редактирование имени пользователя</Typography>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Typography>Редактирование Email</Typography>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Typography>Редактирование пароля</Typography>
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <Typography>Удаление аккаунта</Typography>
                        </TabPanel>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
};

export default AccountSettings;