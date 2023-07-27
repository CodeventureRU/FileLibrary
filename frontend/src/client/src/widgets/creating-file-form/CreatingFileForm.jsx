import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Paper,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";
import {MultipleFileUpload} from "../../features/multiple-file-upload/index.js";
import {ResourceInfoForm, useResourceInfoForm} from "../../features/resource-info-form/index.js";
import {ResourcePrivacyForm, useResourcePrivacy} from "../../features/resource-privacy-form/index.js";
import {LoadingButton} from "../../shared/ui/loading-button/index.js";
import {useCreateResourceFile} from "../../entities/resource/index.js";
import {NavLink} from "react-router-dom";

const CreatingFileForm = () => {
    // Ошибки
    const {errors, loading, createRequest} = useCreateResourceFile();
    const [success, setSuccess] = useState(false);

    // Функции по обеспечению работы пошаговой формы
    const [activeStep, setActiveStep] = useState(0);
    const [stepCompleted, setStepCompleted] = useState({
        first: false,
        second: false,
        third: true,
    });
    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };


    // Первый шаг
    const [files, setFiles] = useState([]);
    useEffect(() => {
        setStepCompleted({...stepCompleted, first: files.length > 0})
    }, [files]);

    // Второй шаг
    const resourceInfo = useResourceInfoForm({});

    useEffect(() => {
        setStepCompleted(
            {
                ...stepCompleted,
                second: resourceInfo.name !== "" && (!resourceInfo.usingImage || resourceInfo.image !== null)
            }
        )
    }, [resourceInfo.name, resourceInfo.image, resourceInfo.usingImage]);

    // Третий шаг
    const resourcePrivacy = useResourcePrivacy({});

    // Отправка формы
    const handleCreate = async () => {
        let res = await createRequest({
            name: resourceInfo.name,
            description: resourceInfo.description,
            image: resourceInfo.usingImage ? resourceInfo.imageFile : null,
            privacyLevel: resourcePrivacy.privacyLevel,
            files: files,
        });

        if (res !== null) {
            setSuccess(true);
            setActiveStep(3);
        }
    }


    return (
        <Box sx={{mt: 5}}>
            <Typography variant="h6">Добавление файла</Typography>
            <Paper variant="outlined" sx={{p: 3, mt: 2}}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    <Step>
                        <StepLabel error={errors?.files}>
                            Загрузка файла
                        </StepLabel>
                        <StepContent>
                            <Box sx={{mt: 2}}>
                                <MultipleFileUpload files={files} setFiles={setFiles} />
                            </Box>

                            <Box >
                                <div>
                                    <Button
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                        disabled={!stepCompleted.first}
                                        variant="outlined"
                                    >
                                        Далее
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel error={Boolean(errors?.name) || Boolean(errors?.image) || Boolean(errors?.description)}>
                            Основная информация
                        </StepLabel>
                        <StepContent>
                            <ResourceInfoForm {...resourceInfo} errors={errors} />
                            <Box sx={{ mb: 2 }}>
                                <div>
                                    <Button
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                        disabled={!stepCompleted.second}
                                        variant="outlined"
                                    >
                                        Далее
                                    </Button>
                                    <Button
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                        variant="outlined"
                                    >
                                        Назад
                                    </Button>
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel error={errors?.files}>
                            Настройки публичности
                        </StepLabel>
                        <StepContent>
                            <ResourcePrivacyForm {...resourcePrivacy} errors={errors} />
                            <Box sx={{display: 'flex', alignItems: 'flex-start', mt: 1, mb: 2 }}>
                                    <LoadingButton
                                        disabled={success}
                                        loading={loading}
                                        onClick={handleCreate}
                                        variant="contained"
                                    >
                                        Создать
                                    </LoadingButton>
                                    <Button
                                        disabled={success}
                                        onClick={handleBack}
                                        sx={{ ml: 1 }}
                                        variant="outlined"
                                    >
                                        Назад
                                    </Button>
                            </Box>
                        </StepContent>
                    </Step>
                </Stepper>
                {
                    success ?
                        <>
                            <Alert sx={{mt: 3}} severity="success">Файл успешно добавлен!</Alert>
                            <NavLink to="/profile" color="inherit">
                                <Button color="success" variant="contained" sx={{mt: 2}}>Вернуться в личный кабинет</Button>
                            </NavLink>
                        </>
                        :
                        ""
                }
            </Paper>
        </Box>
    );
};

export default CreatingFileForm;