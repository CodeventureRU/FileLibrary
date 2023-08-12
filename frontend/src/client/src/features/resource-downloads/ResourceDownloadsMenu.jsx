import React, {useEffect, useState} from 'react';
import {ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@mui/material";
import {Download} from "@mui/icons-material";
import {useFetchResource} from "../../entities/resource/index.js";
import {Link} from "react-router-dom";

const ResourceDownloadsMenu = ({
                                   resource,
                                   element,
                                   close,
    increaseDownloads,
                               }) => {

    const menuOpen = Boolean(element);

    const [resourceData, setResourceData] = useState({});
    const {fetchResourceRequest} = useFetchResource(resource?.slug);

    useEffect(() => {
        if (resource?.slug) {
            fetchResourceRequest().then(r => {
                setResourceData(r);
            });
        }
    }, [resource]);

    const handleClick = (...args) => {
        increaseDownloads();
        close(...args);
    }

    return (
        <Menu
            id="resource-downloads-menu"
            anchorEl={element}
            open={menuOpen}
            onClose={close}
            MenuListProps={{
                'aria-labelledby': 'resource-downloads-menu',
            }}
        >
            {
                resourceData?.file?.extensions ? (
                    resourceData?.file?.extensions.split(" ").map(ext =>
                    (
                        ext !== "" ? (
                            <Link key={ext} style={{textDecoration: 'none', color: 'inherit'}} to={`/api/v1/resources/download/${resourceData.slug}/${ext}`}>
                                <MenuItem onClick={handleClick}>
                                    <ListItemIcon>
                                        <Download fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText><Typography>{ext.toUpperCase()}</Typography></ListItemText>
                                </MenuItem>
                            </Link>
                        ) : ""
                    ))
                ) : ""
            }
        </Menu>
    );
};

export default ResourceDownloadsMenu;