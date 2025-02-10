import { useQuery } from "@tanstack/react-query";
import { getSteps } from "../getSteps";

export const useGetSteps = () =>
  useQuery({
    queryKey: ["all-steps"],
    queryFn: async () => {
      const response = await getSteps();
      return response.data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
