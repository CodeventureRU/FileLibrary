import React, {useEffect, useState} from 'react';
import {Box, CircularProgress} from "@mui/material";
import {ErrorsBag} from "../../shared/ui/errors-bag/index.js";
import ResourceList from "../../entities/resource/ui/ResourceList.jsx";
import ResourceGrid from "../../entities/resource/ui/ResourceGrid.jsx";

const ViewModeResourcesList = ({
    loading,
    requested,
    errors,
    viewModeObj,
    resourcesList,
    resourcesGrid
    }) => {

    const [detailsErrors, setDetailsErrors] = useState([]);
    useEffect(() => {
        setDetailsErrors(errors?.detail ? [errors.detail] : []);
    }, [errors, requested]);

    return (
        <Box sx={{mt: 3}}>
            {
                ( loading || requested === 0 ) ? (
                    // Если загрузка, и при этом ни один запрос не завершен, выводим лоадер
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 3}}>
                        <CircularProgress />
                    </Box>
                ) : (
                    errors?.detail ? (
                        // Если загрузка завершена, и при этом есть ошибки, выводим список ошибок
                        <ErrorsBag errors={detailsErrors} setErrors={setDetailsErrors}/>
                    ) : (
                        // Если загрузка завершена, и при этом ошибок нет, выводим список ресурсов
                        (viewModeObj.viewMode === "list") ? (
                            // Список ресурсов в виде списка
                            <ResourceList>
                                {resourcesList}
                            </ResourceList>
                        ) : (
                            // Список ресурсов в виде карточек
                            <ResourceGrid>
                                {resourcesGrid}
                            </ResourceGrid>
                        )
                    )
                )
            }
        </Box>
    );
};

export default ViewModeResourcesList;