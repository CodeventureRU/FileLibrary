import ResourcePrivacyForm from "./ResourcePrivacyForm.jsx";
import {useState} from "react";

const useResourcePrivacy = (values={}) => {
    const [privacyLevel, setPrivacyLevel] = useState(values.privacy_level ? values.privacy_level : "private");
    const [tags, setTags] = useState(values.tags ? values.tags : "");

    return {
        privacyLevel, setPrivacyLevel,
        tags, setTags
    }
}

export {ResourcePrivacyForm, useResourcePrivacy}