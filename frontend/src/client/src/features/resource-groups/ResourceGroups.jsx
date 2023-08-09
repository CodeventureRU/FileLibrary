import React, {useEffect, useState} from 'react';
import {
    Box,
    Checkbox, Dialog,
    DialogContent,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    Typography
} from "@mui/material";
import {Close, PlaylistAdd} from "@mui/icons-material";
import {
    useAddResourceToGroup,
    useFetchResourceGroups,
    useRemoveResourceFromGroup
} from "../../entities/resource/index.js";

const ResourceGroups = ({resource}) => {

    // Управление модальным окном добавления в группы
    const [openGroupsDialog, setOpenGroupsDialog] = useState(false);

    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState({group: "", add: true});
    const {fetchResourceGroupsRequest} = useFetchResourceGroups(resource ? resource.slug : "");
    const {addResourceToGroupRequest} = useAddResourceToGroup((resource ? resource.slug : ""), selectedGroup.group);
    const {removeResourceFromGroupRequest} = useRemoveResourceFromGroup((resource ? resource.slug : ""), selectedGroup.group);


    const handleOpenGroupsDialog = () => {
        if (resource && resource.type === "file") {
            fetchResourceGroupsRequest().then(r => {
                if (r !== null) {
                    setGroups(r);
                }
            })
        }
        setOpenGroupsDialog(true);
    }

    const handleCloseGroupsDialog = () => {
        setOpenGroupsDialog(false);
    }

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
            <Box sx={{display: "flex", alignItems: "center"}}>
                <IconButton onClick={handleOpenGroupsDialog} sx={{width: '24px', height: '24px'}}>
                    <PlaylistAdd sx={{width: '16px', height: '16px'}} ></PlaylistAdd>
                </IconButton>
            </Box>
            <Dialog
                open={openGroupsDialog}
                onClose={handleCloseGroupsDialog}
                aria-labelledby="groups-dialog-title"
                aria-describedby="groups-dialog-description"
                maxWidth={"xs"}
            >

                <DialogContent>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography variant="body1">
                            Выберите группы
                        </Typography>
                        <IconButton onClick={handleCloseGroupsDialog}>
                            <Close></Close>
                        </IconButton>
                    </Box>
                    <FormControl sx={{ my: 1 }} component="fieldset" variant="standard">
                        <FormGroup>
                            {
                                groups.map(group => (
                                    <FormControlLabel
                                        key={group.resource_id}
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
                {/*<DialogActions>*/}
                {/*    <Button color="error" variant="outlined" onClick={handleCloseGroupsDialog}>Закрыть</Button>*/}
                {/*</DialogActions>*/}
            </Dialog>
        </>
    );
};

export default ResourceGroups;