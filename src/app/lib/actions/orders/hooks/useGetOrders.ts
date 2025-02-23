import { useQuery } from "@tanstack/react-query";
import { ordersActions } from "..";

export function useGetOrders(page: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: () => ordersActions.getOrders(page),
    refetchOnMount: true,
    enabled: options?.enabled !== false,
  });
}
