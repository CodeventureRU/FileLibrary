import React, {useState} from 'react';
import {Pagination} from "@mui/material";

const ResourcesStandardPagination = ({
    loadMore,
    filterAndSortObj,
    numPages,
    limit
                                     }) => {

    const [page, setPage] = useState(1);

    const handleSetPage = (e, p) => {
        setPage(p);
        loadMore({
            sort: filterAndSortObj.sort,
            search: filterAndSortObj.search,
            type: filterAndSortObj.type,
        }, {
            page: p,
            limit: limit,
        }, true)
    }

    return (
        <Pagination sx={{mt: 3}} count={numPages} page={page} onChange={handleSetPage} />
    );
};

export default ResourcesStandardPagination;