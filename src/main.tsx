import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import {RouterProvider} from "react-router/dom";
import {ThemeAppProvider} from "@/app/providers/ThemeAppProvider";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {queryClient} from "@/lib/react-query/queryClient";
import {router} from "@/app/routes";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root element not found");

createRoot(rootEl).render(
    <StrictMode>
        <ThemeAppProvider>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeAppProvider>
    </StrictMode>
);
