import { isRouteErrorResponse, useRouteError } from "react-router";
import ServerUnavailablePage from "./ServerUnavailablePage";

function isNetworkErr(err: unknown): boolean {
    if (!err) return false;
    const msg = (err as any)?.message ?? "";
    return (
        typeof msg === "string" &&
        (msg.includes("Network Error") || msg.includes("Failed to fetch"))
    );
}

export default function RootErrorBoundary() {
    const error = useRouteError();

    if (isNetworkErr(error)) {
        return <ServerUnavailablePage />;
    }

    if (isRouteErrorResponse(error)) {
        const dataMsg =
            (typeof error.data === "object" && error.data && "message" in error.data)
                ? (error.data as any).message
                : (typeof error.data === "string" ? error.data : undefined);

        return <ServerUnavailablePage fallbackMessage={dataMsg} />
    }

    const msg = (error as any)?.message ?? "Unknown Error";

    return <ServerUnavailablePage fallbackMessage={msg} />;
}
