import { useQuery } from "@tanstack/react-query";
import { salesAgentActions } from "..";

export const useGetAllSalesAgents = () =>
  useQuery({
    queryKey: ["all-salesAgents"],
    queryFn: async () => {
      const response = await salesAgentActions.getSalesAgents();
      console.log("Hook received from server:", response);
      return response;
    },
    refetchOnMount: true,
    staleTime: 600000,
    gcTime: 600000,
  });
