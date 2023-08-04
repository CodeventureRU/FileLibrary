import ResourceDownloads from "./ResourceDownloads.jsx";
import {useState} from "react";

const useResourceDownloadsMenu = () => {
    const [element, setElement] = useState(null);
    const [resource, setResource] = useState(null);

    const close = () => {
        setElement(null);
        setResource(null);
    }

    const open = (e, resource) => {
        setElement(e.target);
        setResource(resource);
    }

    return {
        element,
        resource,
        close,
        open
    }
}

export {ResourceDownloads, useResourceDownloadsMenu}