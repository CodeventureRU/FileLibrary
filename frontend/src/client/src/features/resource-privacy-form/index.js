import ResourcePrivacyForm from "./ResourcePrivacyForm.jsx";
import {useState} from "react";

const useResourcePrivacy = (values={}) => {
    const [privacyLevel, setPrivacyLevel] = useState(values.privacyLevel ? values.privacyLevel : "private");

    return {
        privacyLevel, setPrivacyLevel
    }
}

export {ResourcePrivacyForm, useResourcePrivacy}