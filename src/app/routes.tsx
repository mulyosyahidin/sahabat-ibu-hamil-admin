import { createBrowserRouter } from "react-router";
import HomePage from "@/features/home/pages/HomePage";
import AuthLoginPage from "@/features/auth/pages/AuthLoginPage";
import AuthLayout from "@/app/layouts/AuthLayout";
import {requireAuth, requireGuest} from "@/lib/auth";
import AppDashboardPage from "@/features/app/dashboard/pages/AppDashboardPage";
import AppLayout from "@/app/layouts/AppLayout";
import DeviceIndexPage from "@/features/app/devices/pages/DeviceIndexPage";
import DeviceCreatePage from "@/features/app/devices/pages/DeviceCreatePage";
import DeviceShowPage from "@/features/app/devices/pages/DeviceShowPage";
import DeviceEditPage from "@/features/app/devices/pages/DeviceEditPage";
import DeviceConnectPage from "@/features/app/devices/pages/DeviceConnectPage";
import {createDeviceAction} from "@/features/app/devices/actions/createDeviceAction";
import {loadDeviceData} from "@/features/app/devices/loaders/loadDeviceData";
import {updateDeviceAction} from "@/features/app/devices/actions/updateDeviceAction";
import {deleteDeviceAction} from "@/features/app/devices/actions/deleteDeviceAction";
import {LoginAction} from "@/features/auth/actions/loginAction";
import {LogoutAction} from "@/features/auth/actions/logoutAction";
import {requestConnectionAction} from "@/features/app/devices/actions/requestConnectionAction";
import {disconnectDeviceConnection} from "@/features/app/devices/actions/disconnectDeviceConnection";
import { RootErrorBoundary } from "@/components/errors";
import RootLayout from "@/app/layouts/RootLayout";
import {rootMeLoader} from "@/features/auth/loaders/authLoaders";
import {loadDashboardOverviewData} from "@/features/app/dashboard/loaders/dashboard.loader";
import ChatIndexPage from "@/features/app/chats/pages/ChatIndexPage";
import ChatShowPage from "@/features/app/chats/pages/ChatShowPage";
import { loadDevices } from "@/features/app/devices";

export const router = createBrowserRouter([
    {
        id: "root",
        loader: rootMeLoader,
        Component: RootLayout,
        errorElement: <RootErrorBoundary />,
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
                    { path: "dashboard", Component: AppDashboardPage, loader: loadDashboardOverviewData },
                    {
                        path: "devices",
                        children: [
                            { path: "", Component: DeviceIndexPage, loader: loadDevices },
                            { path: "create", Component: DeviceCreatePage, action: createDeviceAction },
                            { path: ":deviceId", Component: DeviceShowPage, loader: loadDeviceData },
                            { path: ":deviceId/edit", Component: DeviceEditPage, loader: loadDeviceData, action: updateDeviceAction },
                            { path: ":deviceId/delete", action: deleteDeviceAction },

                            { path: ":deviceId/connect", Component: DeviceConnectPage, loader: loadDeviceData },
                            { path: ":deviceId/disconnect", action: disconnectDeviceConnection },
                            { path: ":deviceCode/connect/request", action: requestConnectionAction },
                        ],
                    },
                    {
                        path: "chats",
                        children: [
                            { path: "", Component: ChatIndexPage },
                            { path: ":chatId", Component: ChatShowPage },
                        ]
                    }
                ],
            }
        ],
    },
]);
