import { useQuery } from "@tanstack/react-query";
import { vacationsAction } from "../../vacations";

export const useGetAdminVacations = () =>
  useQuery({
    queryKey: ["vacations"],
    queryFn: async () => {
      const response = await vacationsAction.getAdminVacations();
      return response;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    initialDataUpdatedAt: 0,
  });
