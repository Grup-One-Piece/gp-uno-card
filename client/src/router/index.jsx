import { createBrowserRouter } from "react-router-dom";
import NotFound from "../views/NotFound";
import BattlePage from "../views/BattlePage";
import Homepage from "../components/homepage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />,
    },
    {
        path: "/play",
        element: <BattlePage />
    },
    {
        path: "*",
        element: <NotFound />
    },
])


export default router;