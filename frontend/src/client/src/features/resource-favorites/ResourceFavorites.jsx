import React, {useState} from 'react';
import {Box, IconButton, Typography} from "@mui/material";
import {Favorite} from "@mui/icons-material";
import {useAddToFavorites, useRemoveFromFavorites} from "../../entities/resource/index.js";
import {useViewerStore, viewerSelector} from "../../entities/viewer/index.js";

const ResourceFavorites = ({resource, reverse=false}) => {
    const viewer = useViewerStore(viewerSelector);
    const [isFavorite, setIsFavorite] = useState(resource.is_favorite);
    const [numFavorites, setNumFavorites] = useState(resource.num_favorites);
    const {addToFavoritesRequest} = useAddToFavorites(resource.slug);
    const {removeFromFavoritesRequest} = useRemoveFromFavorites(resource.slug);

    const handleToggle = () => {
        if (viewer?.is_active) {
            if (isFavorite) {
                removeFromFavoritesRequest().then(() => {
                    setIsFavorite(false);
                    setNumFavorites(numFavorites - 1);
                });
            } else {
                addToFavoritesRequest().then(() => {
                    setIsFavorite(true);
                    setNumFavorites(numFavorites + 1);
                });
            }
        }

    }

    return (
        <Box sx={{display: "flex", alignItems: "center"}}>
            {
                reverse ? (
                    <IconButton color={isFavorite ? "error" : ""} onClick={handleToggle} sx={{width: '24px', height: '24px'}}>
                        <Favorite sx={{width: '16px', height: '16px'}} ></Favorite>
                    </IconButton>
                ) : ""
            }
            <Typography color={isFavorite ? "error" : "text.secondary"} variant="body2" >{numFavorites}</Typography>
            {
                !reverse ? (
                    <IconButton color={isFavorite ? "error" : ""} onClick={handleToggle} sx={{width: '24px', height: '24px'}}>
                        <Favorite sx={{width: '16px', height: '16px'}} ></Favorite>
                    </IconButton>
                ) : ""
            }
        </Box>
    );
};

export default ResourceFavorites;