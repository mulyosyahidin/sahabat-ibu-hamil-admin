import { redirect } from "react-router";
import { api, clearToken } from "@/lib/api";
import {queryClient} from "@/lib/react-query/queryClient";
import {authKeys} from "@/features/auth/_react-query/queryKeys";

export async function LogoutAction() {
    await api.delete("/auth/logout", {}).catch(() => {});

    clearToken();
    queryClient.setQueryData(authKeys.me, null);

    return redirect("/auth/login");
}
