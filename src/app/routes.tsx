import {createBrowserRouter} from "react-router";
import HomePage from "@/features/home/HomePage";

let routes = createBrowserRouter([
    {
        path: "/",
        Component: HomePage,
    }
]);

export default routes;