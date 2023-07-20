import {createBrowserRouter} from "react-router-dom";
import Layout from "../../pages/layout/index.js";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
    },
]);