import React, {useMemo, useState} from 'react';
import {useCreateResource} from "../../entities/resource/index.js";
import {ResourceInfoForm, useResourceInfoForm} from "../../features/resource-info-form/index.js";
import {ResourcePrivacyForm, useResourcePrivacy} from "../../features/resource-privacy-form/index.js";
import {Alert, Button} from "@mui/material";
import {SteppedForm} from "../../features/stepped-form/index.js";
import {NavLink} from "react-router-dom";

const CreatingGroupForm = () => {
    const {errors, loading, createRequest} = useCreateResource();
    const [end, setEnd] = useState(false);
    const [success, setSuccess] = useState(false);

    const resourceInfo = useResourceInfoForm({});
    const resourcePrivacy = useResourcePrivacy({});

    const handleCreate = async () => {
        let res = await createRequest({
            name: resourceInfo.name,
            description: resourceInfo.description,
            image: resourceInfo.usingImage ? resourceInfo.imageFile : null,
            privacyLevel: resourcePrivacy.privacyLevel,
            tags: resourcePrivacy.tags,
            type: "group",
        });

        if (res !== null) {
            setSuccess(true);
            setEnd(true);
        }
    }

    const steps = useMemo(() => ([
        {
            label: "Основная информация",
            content: <ResourceInfoForm {...resourceInfo} errors={errors} />,
            completed: resourceInfo.name !== "" && (!resourceInfo.usingImage || resourceInfo.image !== null),
            error: Boolean(errors?.name) || Boolean(errors?.image) || Boolean(errors?.description)
        },
        {
            label: "Настройки публичности",
            content: <ResourcePrivacyForm {...resourcePrivacy} errors={errors} />,
            completed: true,
            error: errors?.privacy_level,
            buttons: <>
                <Button variant="contained" onClick={handleCreate}>Сохранить</Button>
            </>
        },
    ]), [resourceInfo, resourcePrivacy]);

    return (
        <SteppedForm
            title="Добавление группы"
            steps={steps}
            end={end}
            loading={loading}
            feedback={
                success ?
                    <>
                        <Alert sx={{mt: 3}} severity="success">Группа успешно добавлена!</Alert>
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

export default CreatingGroupForm;