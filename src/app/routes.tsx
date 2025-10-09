import { createBrowserRouter } from "react-router";
import HomePage from "@/features/home/pages/HomePage";
import AuthLoginPage from "@/features/auth/login/pages/AuthLoginPage";
import AuthLayout from "@/app/layouts/AuthLayout";
import {requireAuth, requireGuest} from "@/lib/auth";
import { LoginAction } from "@/features/auth/_actions/loginAction";
import AppDashboardPage from "@/features/app/dashboard/pages/AppDashboardPage";
import AppLayout from "@/app/layouts/AppLayout";
import {LogoutAction} from "@/features/auth/_actions/logoutAction";
import {rootMeLoader} from "@/features/auth/_loaders/loaders";

export const router = createBrowserRouter([
    {
        id: "root",
        loader: rootMeLoader,
        children: [
            { path: "/", Component: HomePage },
            {
                path: "auth",
                Component: AuthLayout,
                children: [
                    { path: "login", Component: AuthLoginPage, action: LoginAction, loader: requireGuest, },
                    { path: "logout", action: LogoutAction, loader: requireAuth },
                ],
            },
            {
                path: "app",
                Component: AppLayout,
                loader: requireAuth,
                children: [
                    { path: "dashboard", Component: AppDashboardPage }
                ],
            }
        ],
    },
]);
