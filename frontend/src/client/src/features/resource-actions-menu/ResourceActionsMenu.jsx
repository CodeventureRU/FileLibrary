import React from 'react';
import {NavLink} from "react-router-dom";
import {ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@mui/material";
import {Delete, Edit, Folder} from "@mui/icons-material";

const ResourceActionsMenu = ({
    resource,
    element,
    close,
    editAction=true,
    deleteAction=true,
    addGroupsAction=true,
}) => {

    const menuOpen = Boolean(element);

    const resourceEditLink = resource ? (
        (resource.type === 'file' ? '/edit-file/' : '/edit-group/')
            +
        (resource.slug ? resource.slug : resource.id)
    ) : "";

    return (
        <Menu
            id="resource-actions-menu"
            anchorEl={element}
            open={menuOpen}
            onClose={close}
            MenuListProps={{
                'aria-labelledby': 'resource-actions-menu',
            }}
        >
            {
                editAction ? (
                    <NavLink to={resourceEditLink} style={{color: "inherit", textDecoration: 'none'}}>
                        <MenuItem onClick={close}>
                            <ListItemIcon>
                                <Edit fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Редактировать</ListItemText>
                        </MenuItem>
                    </NavLink>
                ) : ""
            }
            {
                (resource && addGroupsAction) ? (
                  resource.type === 'file' ? (
                      <MenuItem onClick={close}>
                          <ListItemIcon>
                              <Folder fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Группы</ListItemText>
                      </MenuItem>
                  ) : ""
               ) : ""
            }
            {
                deleteAction ? (
                    <NavLink to={resourceEditLink} style={{color: "inherit", textDecoration: 'none'}}>
                        <MenuItem onClick={close}>
                            <ListItemIcon>
                                <Delete color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText><Typography color="error">Удалить</Typography></ListItemText>
                        </MenuItem>
                    </NavLink>
                ) : ""
            }
        </Menu>
    );
};

export default ResourceActionsMenu;