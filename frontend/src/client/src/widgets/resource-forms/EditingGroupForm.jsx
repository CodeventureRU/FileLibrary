import React, {useMemo, useState} from 'react';
import {useUpdateResource} from "../../entities/resource/index.js";
import {ResourceInfoForm, useResourceInfoForm} from "../../features/resource-info-form/index.js";
import {ResourcePrivacyForm, useResourcePrivacy} from "../../features/resource-privacy-form/index.js";
import {Alert, Button} from "@mui/material";
import {SteppedForm} from "../../features/stepped-form/index.js";
import {NavLink} from "react-router-dom";

const EditingGroupForm = ({resource}) => {
    const {errors, loading, updateRequest} = useUpdateResource(resource.slug);
    const [end] = useState(false);
    const [success] = useState(false);

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

    const steps = useMemo(() => ([
        {
            label: "Основная информация",
            content: <ResourceInfoForm {...resourceInfo} errors={errors} />,
            completed: resourceInfo.name !== "" && (!resourceInfo.usingImage || resourceInfo.image !== null),
            error: Boolean(errors?.name) || Boolean(errors?.image) || Boolean(errors?.description),
            buttons: <>
                <Button variant="contained" onClick={handleUpdateInfo}>Сохранить</Button>
            </>
        },
        {
            label: "Настройки публичности",
            content: <ResourcePrivacyForm {...resourcePrivacy} errors={errors} />,
            completed: true,
            error: errors?.privacy_level,
            buttons: <>
                <Button variant="contained" onClick={handleUpdatePrivacy}>Сохранить</Button>
            </>
        },
    ]), [resourceInfo, resourcePrivacy]);

    return (
        <SteppedForm
            title="Редактирование группы"
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

export default EditingGroupForm;