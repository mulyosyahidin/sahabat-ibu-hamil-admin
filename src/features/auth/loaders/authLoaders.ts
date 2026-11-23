import { meQueryOptions } from "../queries/me.query";
import {queryClient} from "@/lib/react-query/queryClient";

export async function rootMeLoader() {
    queryClient.prefetchQuery(meQueryOptions()).catch(() => {});

    return null
}
