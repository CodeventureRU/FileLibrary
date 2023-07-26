import React from 'react';
import {Box, Button, CircularProgress} from "@mui/material";

const LoadingButton = ({children, onClick, loading}) => {
    return (
        <Box sx={{ m: 1, position: 'relative' }}>
            <Button
                variant="contained"
                onClick={onClick}
                disabled={loading}
            >
                {children}
            </Button>
            {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                        color: 'primary',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
        </Box>
    );
};

export default LoadingButton;