import ResourceActionsMenu from "./ResourceActionsMenu";
import ResourceHeaderAction from "./ResourceHeaderAction";
import ResourceMainAction from "./ResourceMainAction";
import {useState} from "react";

const useResourceActionMenu = () => {
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

export {ResourceActionsMenu, useResourceActionMenu, ResourceHeaderAction, ResourceMainAction}