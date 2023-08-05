import React, {useState} from 'react';
import {Box, IconButton, Typography} from "@mui/material";
import {Download} from "@mui/icons-material";
import ResourceDownloadsMenu from "./ResourceDownloadsMenu.jsx";
import {useResourceDownloadsMenu} from "./index.js";

const ResourceDownloads = ({resource, reverse=false}) => {

    const [numDownloads, setNumDownloads] = useState(resource?.downloads !== undefined ? resource?.downloads : resource?.file?.downloads);
    const {element: resourceDownloadsMenuAnchor, resource: resourceDownloadsMenuData, close: closeResourceDownloadsMenu, open: openResourceDownloadsMenu} = useResourceDownloadsMenu();

    return (
        <>
            <Box sx={{display: "flex", alignItems: "center"}}>
                {
                    reverse ? (
                        <IconButton onClick={e => openResourceDownloadsMenu(e, resource)} sx={{width: '24px', height: '24px'}}>
                            <Download sx={{width: '16px', height: '16px'}} ></Download>
                        </IconButton>
                    ) : ""
                }
                <Typography variant="body2" color="text.secondary">{numDownloads}</Typography>
                {
                    !reverse ? (
                        <IconButton onClick={e => openResourceDownloadsMenu(e, resource)} sx={{width: '24px', height: '24px'}}>
                            <Download sx={{width: '16px', height: '16px'}} ></Download>
                        </IconButton>
                    ) : ""
                }
            </Box>
            <ResourceDownloadsMenu
                increaseDownloads={() => setNumDownloads(numDownloads + 1)}
                resource={resourceDownloadsMenuData}
                element={resourceDownloadsMenuAnchor}
                close={closeResourceDownloadsMenu}
            />
        </>

    );
};

export default ResourceDownloads;