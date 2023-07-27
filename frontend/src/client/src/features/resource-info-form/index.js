import ResourceInfoForm from "./ResourceInfoForm.jsx";
import {useState} from "react";

const useResourceInfoForm = (values={}) => {
    const [name, setName] = useState(values.name ? values.name : "");
    const [description, setDescription] = useState(values.description ? values.description : "");
    const [usingImage, setUsingImage] = useState(Boolean(values.image));
    const [image, setImage] = useState(values.image ? values.image : null);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState(null);

    return {
        name, setName,
        description, setDescription,
        usingImage, setUsingImage,
        image, setImage,
        imageFile, setImageFile,
        imageError, setImageError,
    }
}

export {ResourceInfoForm, useResourceInfoForm};