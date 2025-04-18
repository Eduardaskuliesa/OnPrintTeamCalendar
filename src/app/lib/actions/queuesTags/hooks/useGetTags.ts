import { useQuery } from "@tanstack/react-query";
import { getTags } from "../getTags";

export const useGetTags = () =>
  useQuery({
    queryKey: ["all-tags"],
    queryFn: async () => {
      const response = await getTags();
      return response.data;
    },
    refetchOnMount: true,
    staleTime: 600000,
    gcTime: 600000,
  });
