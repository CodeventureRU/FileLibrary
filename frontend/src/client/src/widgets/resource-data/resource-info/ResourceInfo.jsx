import React from 'react';
import ResourceInfoSection from "../../../entities/resource/ui/ResourceInfoSection.jsx";
import {Box} from "@mui/material";
import ResourceFavorites from "../../../features/resource-favorites/ResourceFavorites.jsx";
import {ResourceDownloads} from "../../../features/resource-downloads/index.js";
import {isAuthSelector, useViewerStore, viewerSelector} from "../../../entities/viewer/index.js";
import {
    ResourceActionsMenu,
    ResourceHeaderAction,
    useResourceActionMenu
} from "../../../features/resource-actions-menu/index.js";

const ResourceInfo = ({loading, requested, resource}) => {
    const viewer = useViewerStore(viewerSelector);
    const isAuth = useViewerStore(isAuthSelector);

    // Данные всплювающих меню
    const {element: resourceActionsMenuAnchor, resource: resourceActionsMenuData, close: closeResourceActionsMenu, open: openResourceActionsMenu} = useResourceActionMenu();

    return (
        <>
            <Box sx={{mt: 5}}>
                {!loading && requested > 0 ?
                    <ResourceInfoSection
                        resource={resource}
                        mainActions={
                            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: "space-between", gap: 1}}>
                                <ResourceFavorites reverse={true} resource={resource}></ResourceFavorites>
                                {
                                    resource.type === "file" ? (
                                        <ResourceDownloads reverse={true} resource={resource} open={() => {}}></ResourceDownloads>
                                    ) : ""
                                }
                            </Box>
                        }
                        action={
                            (isAuth && (viewer.username === resource.author || (resource.type === 'file' && true))) ? (
                                <ResourceHeaderAction resource={resource} open={openResourceActionsMenu} />
                            ) : ""
                        }
                    />
                    : ""
                }
            </Box>

            <ResourceActionsMenu
                resource={resourceActionsMenuData}
                element={resourceActionsMenuAnchor}
                close={closeResourceActionsMenu}
                editAction={viewer.username === resource.author}
                deleteAction={viewer.username === resource.author}
            />
        </>
    );
};

export default ResourceInfo;