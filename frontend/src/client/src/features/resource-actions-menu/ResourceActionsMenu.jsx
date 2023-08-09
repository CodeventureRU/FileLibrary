import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import {
    Button,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {
    removeResourceSelector,
    useRemoveResource,
    useResourcesStore
} from "../../entities/resource/index.js";

const ResourceActionsMenu = ({
    resource,
    element,
    close,
    editAction=true,
    deleteAction=true,
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
                {/*{*/}
                {/*    (resource && addGroupsAction) ? (*/}
                {/*      resource.type === 'file' ? (*/}
                {/*          <MenuItem onClick={handleOpenGroupsDialog}>*/}
                {/*              <ListItemIcon>*/}
                {/*                  <Folder fontSize="small" />*/}
                {/*              </ListItemIcon>*/}
                {/*              <ListItemText>Группы</ListItemText>*/}
                {/*          </MenuItem>*/}
                {/*      ) : ""*/}
                {/*   ) : ""*/}
                {/*}*/}
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
        </>
    );
};

export default ResourceActionsMenu;