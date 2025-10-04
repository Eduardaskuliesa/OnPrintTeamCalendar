import { useQuery } from "@tanstack/react-query";
import { tempalteActions } from "..";

export const useGetTemplates = () =>
  useQuery({
    queryKey: [`templates`],
    queryFn: async () => {
      const response = await tempalteActions.getTemplates();
      return response;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
