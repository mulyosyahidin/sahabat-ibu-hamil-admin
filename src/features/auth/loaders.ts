import { meQueryOptions } from "@/features/auth/me.query";
import {queryClient} from "@/lib/react-query/queryClient";

export async function rootMeLoader() {
    return queryClient.ensureQueryData(meQueryOptions());
}
