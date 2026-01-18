import { useGetUserVacations } from "./useGetUserVacations";
import { useGetFreshUser } from "./useGetFreshUser";
import {
  calculateVacationStats,
  VacationStats,
} from "@/app/lib/utils/vacationStatsCalculator";

interface UseUserVacationStatsResult {
  stats: VacationStats | null;
  isLoading: boolean;
  isError: boolean;
}

export const useUserVacationStats = (
  userId: string
): UseUserVacationStatsResult => {
  const userQuery = useGetFreshUser(userId);
  const vacationsQuery = useGetUserVacations(userId);

  const isLoading = userQuery.isLoading || vacationsQuery.isLoading;
  const isError = userQuery.isError || vacationsQuery.isError;

  const stats =
    userQuery.data && vacationsQuery.data
      ? calculateVacationStats(userQuery.data, vacationsQuery.data)
      : null;

  return {
    stats,
    isLoading,
    isError,
  };
};
