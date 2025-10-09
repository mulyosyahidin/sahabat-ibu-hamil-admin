import {queryClient} from "@/lib/react-query/queryClient";
import {meQueryOptions} from "@/features/auth/_react-query/me.query";

export async function rootMeLoader() {
    return queryClient.ensureQueryData(meQueryOptions());
}
