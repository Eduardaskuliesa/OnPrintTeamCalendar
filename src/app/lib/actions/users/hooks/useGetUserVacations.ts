import { useQuery } from "@tanstack/react-query";
import { Vacation } from "@/app/types/api";
import { getUserVacations } from "../getUsersVacations";

export const useGetUserVacations = (userId: string) =>
  useQuery<Vacation[]>({
    queryKey: ["vacations", userId],
    queryFn: async () => {
      const response = await getUserVacations(userId);
      return response.data;
    },
    refetchOnWindowFocus: true,
    enabled: userId !== "",
  });
