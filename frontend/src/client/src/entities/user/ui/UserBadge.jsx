import React, {lazy, Suspense} from 'react';
import {Button} from "@mui/material";

const AccountCircleIcon = lazy(() => import("@mui/icons-material/AccountCircle"))

const UserBadge = React.memo(({username}) => {
    return (
        <Suspense fallback={
            <Button
                variant="contained"
                sx={{textTransform: 'none', borderRadius: "200px"}}
            >
                {username}
            </Button>
        }>
            <Button
                sx={{textTransform: 'none', borderRadius: "200px"}}
                variant="contained"
                endIcon={
                    <AccountCircleIcon
                        sx={{width: '24px', height: '24px'}}
                    />
                }
            >
                {username}
            </Button>
        </Suspense>
    );
});

export default UserBadge;