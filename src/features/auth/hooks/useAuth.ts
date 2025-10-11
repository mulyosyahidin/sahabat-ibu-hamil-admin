import { useQuery } from "@tanstack/react-query"
import {meQueryOptions} from "@/features/auth/queries/me.query";

export function useMeQuery() {
    return useQuery(meQueryOptions());
}
