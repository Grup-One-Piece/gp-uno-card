import { createBrowserRouter } from "react-router-dom";
import NotFound from "../views/NotFound";


const router = createBrowserRouter([
    {
        path: "/",
    },
    {
        path: "/room",
    },
    {
        path: "*",
        element: <NotFound />
    },
])


export default router;