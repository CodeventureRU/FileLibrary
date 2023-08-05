import React, {memo, useCallback, useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";

const FormStep = memo(({step, handleNext, handleBack, first, last}) => {
    return (
        <>
            <StepLabel error={step.error}>{step.label}</StepLabel>
            <StepContent>
                { step.content }
                <Box sx={{ mb: 2, mt: 1 }}>
                    <div>
                        {
                            step.buttons
                        }
                        {
                            !last
                            ? <Button
                                    onClick={handleNext}
                                    sx={{ml: 1 }}
                                    disabled={Boolean(!step.completed)}
                                    variant="outlined"
                                >
                                    Далее
                                </Button>
                            : ""
                        }
                        {
                            !first
                            ? <Button
                                    onClick={handleBack}
                                    sx={{ml: 1 }}
                                    variant="outlined"
                                >
                                    Назад
                                </Button>
                            : ""
                        }
                    </div>
                </Box>
            </StepContent>
        </>
    );
});

const FormFeedback = memo(({feedback}) => {
    return (
        <>
            {
                Boolean(feedback) ?
                <>
                    {feedback}
                </>
                : ""
            }
        </>
    )
});

const FormLoading = memo(({loading}) => {
   return (
       <>
           {
               loading ?
                   <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
                       <CircularProgress></CircularProgress>
                   </Box>
               : ""
           }
       </>
   )
});

const SteppedForm = ({title, steps, feedback, end, loading}) => {

    // Функции по обеспечению работы пошаговой формы
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = useCallback(() => {
        setActiveStep(current => current + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep(current => current - 1);
    }, []);

    useEffect(() => {
        if (end) {
            setActiveStep(steps.length);
        } else {
            setActiveStep(0);
        }
    }, [end]);

    return (
        <Box sx={{mt: 5}}>
            <Typography variant="h6">{title}</Typography>
            <Paper variant="outlined" sx={{p: 3, mt: 2}}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {
                        steps.map((step, index) =>
                            <Step key={step.label}>
                                <FormStep
                                    key={step.label}
                                    step={step}
                                    first={index === 0}
                                    last={index === steps.length - 1}
                                    handleNext={handleNext}
                                    handleBack={handleBack}
                                ></FormStep>
                            </Step>

                        )
                    }
                </Stepper>
                <FormFeedback feedback={feedback}></FormFeedback>
                <FormLoading loading={loading}></FormLoading>
            </Paper>
        </Box>
    );
};

export default SteppedForm;