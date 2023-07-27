import React, {useState} from 'react';
import {alpha, Box, Button, Divider, IconButton, List, ListItem, ListItemText, Typography} from "@mui/material";
import {Close, FileUpload} from "@mui/icons-material";
import {ErrorsBag} from "../errors-bag/index.js";

const MultipleFileUpload = ({files, setFiles}) => {

    const [errors, setErrors] = useState([]);
    const hasDuplicateExtension = (newFiles, extension) => {
        return newFiles.some((file) => file.type === extension);
    };

    const handleFileChange = (event) => {
        const newFiles = [...files];
        const currentLoadingErrors = [];
        Array.from(event.target.files).forEach((file) => {
            const splitName = file.name.split('.');
            const extension = splitName[splitName.length - 1].toLowerCase();
            if (!hasDuplicateExtension(newFiles, extension)) {
                newFiles.push({
                    name: file.name,
                    type: extension,
                    file,
                });
            } else {
                currentLoadingErrors.push(`Файл "${file.name}" не прикреплен, так как это расширение уже добавлено`);
            }
        });

        setErrors(currentLoadingErrors);
        setFiles(newFiles);
    };

    const handleRemoveFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((file, i) => i !== index));
    };

    return (
        <div>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                <Button
                    variant="contained"
                    component="label"
                    endIcon={<FileUpload />}
                >
                    Добавить
                    <input
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        hidden
                    />
                </Button>
                <Typography variant="caption" color="text.secondary">
                    Вы можете добавить файл в нескольких расширениях
                </Typography>
            </Box>

            <List sx={{my: 2}}>
                {files.map((file, index) => (
                    <React.Fragment key={file.type}>
                        {index === 0 ? <Divider /> : ""}
                        <ListItem>
                            <ListItemText primary={
                                <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                    <Typography color="primary" sx={{textTransform: 'uppercase', borderRadius: '5px', padding: '3px 5px', bgcolor: theme => alpha(theme.palette.primary.main, 0.1)}}>{file.type}</Typography>
                                    <Typography>{file.name}</Typography>
                                </Box>
                            } />
                            <IconButton onClick={() => handleRemoveFile(index)} color="error">
                                <Close />
                            </IconButton>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
            <ErrorsBag setErrors={setErrors} errors={errors} />
        </div>
    );
};

export default MultipleFileUpload;