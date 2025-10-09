import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import {RouterProvider} from "react-router/dom";
import routes from "@/app/routes";
import {ThemeAppProvider} from "@/app/providers/ThemeAppProvider";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root element not found");

createRoot(rootEl).render(
    <StrictMode>
        <ThemeAppProvider>
            <RouterProvider router={routes} />
        </ThemeAppProvider>
    </StrictMode>
);
