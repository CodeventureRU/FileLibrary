import React from 'react';
import {FavoriteResourcesList} from "../../widgets/resources-lists/index.js";
import {FavoritesHeader} from "../../widgets/favorites-header/index.js";

const Favorites = () => {
    return (
        <>
            <FavoritesHeader />
            <FavoriteResourcesList />
        </>
    );
};

export default Favorites;