import React from 'react';
import {GridFormControl} from "../../shared/ui/grid-form-control/index.js";
import {Alert, Button, FormControlLabel, Grid, Switch} from "@mui/material";
import {Close, FileUpload} from "@mui/icons-material";

const ResourceInfoForm = ({
                            name, setName,
                            description, setDescription,
                            usingImage, setUsingImage,
                            image, setImage,
                            imageError, setImageError,
                            errors
                          }) => {

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return; // If no file selected, do nothing

        // Check if the selected file is an image
        if (!file.type.startsWith('image')) {
            setImageError('Выбранный файл не является изображением');
            return;
        }

        // Check if the selected image size is less than 5MB
        if (file.size > 5 * 1024 * 1024) {
            setImageError('Выбранное изображение превышает максимально допустимый размер (5MB)');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
            setImageError('');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    return (
        <Grid container spacing={2} sx={{py: 2}}>
            <GridFormControl
                label="Название"
                field={name}
                setField={setName}
                textFieldOptions={{required: true}}
                errors={errors?.name}
            />
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={usingImage}
                            onChange={e => setUsingImage(e.target.checked)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />}
                    label="Добавить обложку"
                />

            </Grid>
            {
                usingImage ?
                    <Grid item xs={12}>
                        { image === null
                            ? (
                                <>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        endIcon={<FileUpload />}
                                    >
                                        Добавить обложку
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/png,image/jpeg,image/gif,image/bmp"
                                            hidden
                                        />
                                    </Button>
                                    {
                                        imageError ?
                                            (
                                                <Alert sx={{mt: 1}} severity="error">
                                                    {imageError}
                                                </Alert>
                                            )
                                            : ""
                                    }
                                </>
                            ) : (
                                <>
                                    <img src={image} alt="Selected" style={{ width: '100%', maxWidth: '400px', borderRadius: '5px' }} /><br/>
                                    <Button size="small"  color="error" onClick={handleRemoveImage} variant="outlined" startIcon={<Close />}>
                                        Убрать обложку
                                    </Button>
                                </>
                            )
                        }
                    </Grid>
                    : ""
            }
            <GridFormControl
                label="Описание"
                textFieldOptions={{multiline: true, rows: 4}}
                field={description}
                setField={setDescription}
                errors={errors?.description}
            />
        </Grid>
    );
};

export default ResourceInfoForm;