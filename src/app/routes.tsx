import { createBrowserRouter } from "react-router";
import HomePage from "@/features/home/pages/HomePage";
import AuthLoginPage from "@/features/auth/login/pages/AuthLoginPage";
import AuthLayout from "@/app/layouts/AuthLayout";
import { requireGuest } from "@/lib/auth";
import { LoginAction } from "@/features/auth/login/actions/loginAction";
import { rootMeLoader } from "@/features/auth/loaders";

export const router = createBrowserRouter([
    {
        id: "root",
        loader: rootMeLoader,
        children: [
            { path: "/", Component: HomePage },
            {
                path: "auth",
                Component: AuthLayout,
                loader: requireGuest,
                children: [
                    { path: "login", Component: AuthLoginPage, action: LoginAction },
                ],
            },
        ],
    },
]);
