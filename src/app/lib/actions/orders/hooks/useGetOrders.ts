import { useQuery } from "@tanstack/react-query";
import { getOrders } from "..";

export function useGetOrders(page: number) {
    return useQuery({
        queryKey: ["orders", page],
        queryFn: () => getOrders(page),
        refetchOnMount: true,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}