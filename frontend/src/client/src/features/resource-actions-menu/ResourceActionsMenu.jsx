import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {
    Button, Checkbox,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle, FormControl, FormControlLabel, FormGroup,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import {Delete, Edit, Folder} from "@mui/icons-material";
import {
    removeResourceSelector, useAddResourceToGroup,
    useFetchResourceGroups,
    useRemoveResource, useRemoveResourceFromGroup,
    useResourcesStore
} from "../../entities/resource/index.js";

const ResourceActionsMenu = ({
    resource,
    element,
    close,
    editAction=true,
    deleteAction=true,
    addGroupsAction=true,
}) => {

    const {removeResourceRequest} = useRemoveResource(resource ? resource.slug : "");
    const menuOpen = Boolean(element);

    const resourceEditLink = resource ? (
        (resource.type === 'file' ? '/editing-file/' : '/editing-group/')
            +
        (resource.slug ? resource.slug : resource.id)
    ) : "";

    const removeResource = useResourcesStore(removeResourceSelector);
    const handleRemove = async () => {
        await removeResourceRequest();
        removeResource(resource.slug);
        handleCloseDeletionConfirmationDialog();
    }

    // Упраление модальным окном подтверждения удаления
    const [deletionConfirmationDialogOpen, setDeletionConfirmationDialogOpen] = useState(false);

    const handleClickDeletionConfirmationDialogOpen = () => {
        setDeletionConfirmationDialogOpen(true);
    };

    const handleCloseDeletionConfirmationDialog = () => {
        setDeletionConfirmationDialogOpen(false);
        close();
    };

    // Управление модальным окном добавления в группы
    const [openGroupsDialog, setOpenGroupsDialog] = useState(false);

    const handleOpenGroupsDialog = () => {
        setOpenGroupsDialog(true);
    }

    const handleCloseGroupsDialog = () => {
        setOpenGroupsDialog(false);
        close();
    }

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState({group: "", add: true});
    const {fetchResourceGroupsRequest} = useFetchResourceGroups(resource ? resource.slug : "");
    const {addResourceToGroupRequest} = useAddResourceToGroup((resource ? resource.slug : ""), selectedGroup.group);
    const {removeResourceFromGroupRequest} = useRemoveResourceFromGroup((resource ? resource.slug : ""), selectedGroup.group);

    useEffect(() => {
        if (resource && resource.type === "file") {
            fetchResourceGroupsRequest().then(r => {
                setGroups(r);
            })
        }
    }, [resource]);

    const handleToggleGroup = (groupResourceId, add=true) => {
        setSelectedGroup({group: groupResourceId, add});
    }

    useEffect(() => {
        const {add, group} = selectedGroup;
        if (group) {
            if (add) {
                addResourceToGroupRequest().then(() => {
                    setGroups(groups => groups.map(g => g.resource_id === group ? {...g, is_added: true} : g))
                });
            } else {
                removeResourceFromGroupRequest().then(() => {
                    setGroups(groups => groups.map(g => g.resource_id === group ? {...g, is_added: false} : g))
                });
            }
        }

    }, [selectedGroup]);


    return (
        <>
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
                          <MenuItem onClick={handleOpenGroupsDialog}>
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
                        <MenuItem onClick={handleClickDeletionConfirmationDialogOpen}>
                            <ListItemIcon>
                                <Delete color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText><Typography color="error">Удалить</Typography></ListItemText>
                        </MenuItem>
                    ) : ""
                }
            </Menu>
            <Dialog
                open={deletionConfirmationDialogOpen}
                onClose={handleCloseDeletionConfirmationDialog}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-description"
            >
                <DialogTitle id="confirmation-dialog-title">
                    {`Вы действительно хотите удалить ${resource ? (resource.type === 'file' ? 'Файл' : "Группу") : ""}?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirmation-dialog-description">
                        {`Восстановить ${resource ? (resource.type === 'file' ? 'удаленный файл' : "удаленную группу") : ""} будет невозможно`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="outlined" onClick={handleCloseDeletionConfirmationDialog}>Отмена</Button>
                    <Button color="error" variant="contained" onClick={handleRemove} autoFocus>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openGroupsDialog}
                onClose={handleCloseGroupsDialog}
                aria-labelledby="groups-dialog-title"
                aria-describedby="groups-dialog-description"
                maxWidth={"xs"}
            >
                <DialogTitle id="groups-dialog-title">
                    Укажите группы, в которые Вы хотите добавить файл
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="groups-dialog-description">
                        Поставьте галочки напротив выбранных групп
                    </DialogContentText>
                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                        <FormGroup>
                            {
                                groups.map(group => (
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={group.is_added} onChange={() => handleToggleGroup(group.resource_id, !group.is_added)} />
                                        }
                                        label={group.name}
                                    />
                                ))
                            }
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="outlined" onClick={handleCloseGroupsDialog}>Закрыть</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ResourceActionsMenu;