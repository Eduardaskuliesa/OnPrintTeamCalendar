import { useQuery } from "@tanstack/react-query";
import { ordersActions } from "..";
import { FilterState } from "@/app/types/orderFilter";

export function useFilteredOrders(
  filters: FilterState,
  page: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["orders", page, filters],
    queryFn: () => ordersActions.getFilteredOrders(filters, page),
    refetchOnMount: true,
    enabled: options?.enabled !== false,
  });
}
