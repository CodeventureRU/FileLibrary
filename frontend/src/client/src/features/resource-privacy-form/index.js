import ResourcePrivacyForm from "./ResourcePrivacyForm.jsx";
import {useState} from "react";

const useResourcePrivacy = (values={}) => {
    const [privacyLevel, setPrivacyLevel] = useState(values.privacy_level ? values.privacy_level : "private");

    return {
        privacyLevel, setPrivacyLevel
    }
}

export {ResourcePrivacyForm, useResourcePrivacy}