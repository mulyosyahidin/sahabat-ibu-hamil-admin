import { useQuery } from "@tanstack/react-query"
import {meQueryOptions} from "@/features/auth/_react-query/me.query";

export function useMeQuery() {
    return useQuery(meQueryOptions());
}
