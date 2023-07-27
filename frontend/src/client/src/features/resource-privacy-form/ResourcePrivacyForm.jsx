import React from 'react';
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
} from "@mui/material";
import helperTextError from "../helper-text-error/index.js";

const ResourcePrivacyForm = ({privacyLevel, setPrivacyLevel, errors}) => {
    return (
        <Grid container spacing={2} sx={{py: 2}}>
            <Grid item xs={12}>
                <FormControl error={Boolean(errors?.privacy_level)}>
                    <FormLabel id="privacy-radio-group">Кто может видеть</FormLabel>
                    <RadioGroup
                        aria-labelledby="privacy-radio-group"
                        name="privacy-radio-group"
                        value={privacyLevel}
                        onChange={e => setPrivacyLevel(e.target.value)}
                    >
                        <FormControlLabel value="private" control={<Radio />} label="Только я" />
                        <FormControlLabel value="link_only" control={<Radio />} label="Люди по ссылке" />
                        <FormControlLabel value="public" control={<Radio />} label="Все (доступно в поиске)" />
                    </RadioGroup>
                    <FormHelperText>{helperTextError(errors?.privacy_level)}</FormHelperText>
                </FormControl>

            </Grid>
        </Grid>
    );
};

export default ResourcePrivacyForm;