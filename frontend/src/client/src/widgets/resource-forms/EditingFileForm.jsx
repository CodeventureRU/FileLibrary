import React, {useMemo, useState} from 'react';
import {useAddResourceFiles, useRemoveResourceFiles, useUpdateResource} from "../../entities/resource/index.js";
import {ResourceInfoForm, useResourceInfoForm} from "../../features/resource-info-form/index.js";
import {ResourcePrivacyForm, useResourcePrivacy} from "../../features/resource-privacy-form/index.js";
import {MultipleFileUpload} from "../../features/multiple-file-upload/index.js";
import {Alert, Button} from "@mui/material";
import {SteppedForm} from "../../features/stepped-form/index.js";
import {NavLink} from "react-router-dom";

const EditingFileForm = ({resource}) => {
    const {errors, loading, updateRequest} = useUpdateResource(resource.slug);
    const {errors: addResourceFilesErrors, addResourceFilesRequest} = useAddResourceFiles(resource.slug);
    const {errors: removeResourceFilesErrors, removeResourceFilesRequest} = useRemoveResourceFiles(resource.slug);
    const [end] = useState(false);
    const [success] = useState(false);

    const [files, setFiles] = useState(resource.file.extensions.split(" ").filter(e => e !== "").map(e => ({
        type: e,
        name: `file.${e}`,
        file: null,
        default: true,
    })));

    const resourceInfo = useResourceInfoForm(resource);
    const resourcePrivacy = useResourcePrivacy(resource);

    const handleUpdateInfo = async () => {
        await updateRequest({
            name: resourceInfo.name,
            description: resourceInfo.description,
            image: resourceInfo.usingImage ? resourceInfo.imageFile : null,
        });
    }

    const handleUpdatePrivacy = async () => {
        await updateRequest({
            privacyLevel: resourcePrivacy.privacyLevel,
            tags: resourcePrivacy.tags,
        });
    }

    const handleUpdateFiles = async () => {
        const originalExtensions = new Set(resource.file.extensions.split(" ").filter(e => e !== ""));
        const restDefaultExtensions = new Set(files.filter(file => file.default).map(f => f.type));
        const deletions = [...originalExtensions].filter(i => !restDefaultExtensions.has(i));
        await removeResourceFilesRequest({extensions: deletions});

        const newFiles = files.filter(file => file.file !== null);
        await addResourceFilesRequest({files: newFiles});
    }

    const steps = useMemo(() => ([
        {
            label: "Добавление файлов",
            content: <MultipleFileUpload files={files} setFiles={setFiles}></MultipleFileUpload>,
            error: Boolean(addResourceFilesErrors?.files) || Boolean(removeResourceFilesErrors?.extensions),
            completed: true,
            buttons: <>
                <Button disabled={files.length === 0} variant="contained" onClick={handleUpdateFiles}>Сохранить файлы</Button>
            </>
        },
        {
            label: "Основная информация",
            content: <ResourceInfoForm {...resourceInfo} errors={errors} />,
            error: Boolean(errors?.name) || Boolean(errors?.image) || Boolean(errors?.description),
            completed: true,
            buttons: <>
                <Button disabled={!(resourceInfo.name !== "" && (!resourceInfo.usingImage || resourceInfo.image !== null))} variant="contained" onClick={handleUpdateInfo}>Сохранить информацию</Button>
            </>
        },
        {
            label: "Настройки публичности",
            content: <ResourcePrivacyForm {...resourcePrivacy} errors={errors} />,
            completed: true,
            error: errors?.privacy_level,
            buttons: <>
                <Button variant="contained" onClick={handleUpdatePrivacy}>Сохранить настройки</Button>
            </>
        },
    ]), [resourceInfo, resourcePrivacy, files]);

    return (
        <SteppedForm
            title="Редактирование файла"
            steps={steps}
            end={end}
            loading={loading}
            feedback={
                success ?
                    <>
                        <Alert sx={{mt: 3}} severity="success">Файл успешно обновлен!</Alert>
                        <NavLink to="/profile" color="inherit">
                            <Button color="success" variant="contained" sx={{mt: 2}}>Вернуться в личный кабинет</Button>
                        </NavLink>
                    </>
                    :
                    ""
            }
        ></SteppedForm>
    );
};

export default EditingFileForm;