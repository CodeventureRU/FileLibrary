import React from 'react';
import {alpha, Box, Paper, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const FileData = ({loading, requested, resource}) => {
    return (
        <Box sx={{mt: 5, mb: 5}}>
            {!loading && requested > 0 ?
                <Paper sx={{mt: 5, p: 3}} variant="outlined">
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography>Скачать</Typography>
                        <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                            {
                                resource.file.extensions.split(" ").map(ext => (
                                    ext !== "" ?
                                    <Link to={`http://localhost:8000/api/v1/resources/download/${resource.slug}/${ext}/`} style={{textDecoration: "none", color: "inherit"}}><Typography
                                        color="primary"
                                        sx={{
                                            textTransform: 'uppercase',
                                            borderRadius: '5px',
                                            padding: '3px 5px',
                                            bgcolor: theme => alpha(theme.palette.primary.main, 0.1)
                                        }}>
                                        {ext}
                                    </Typography></Link>
                                    : ""
                                ))
                            }
                        </Box>
                    </Box>
                </Paper>
                : ""
            }

        </Box>
    );
};

export default FileData;