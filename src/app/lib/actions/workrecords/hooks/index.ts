import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkRecord } from "../createWorkRecord";
import { getAllMonthlyWorkRecords } from "../getAllMonthlyWorkRecords";
import { WorkRecord } from "@/app/types/api";
import { getUserMonthlyWorkRecords } from "../getUserMonthlyWorkRecords";

export const useUserWorkRecords = (userId: string, yearMonth: string) => {
  return useQuery({
    queryKey: ["workRecords", userId, yearMonth],
    queryFn: async () => {
      const result = await getUserMonthlyWorkRecords(userId, yearMonth);
      return result.data;
    },
  });
};

export const useMonthlyWorkRecords = (yearMonth: string) => {
  return useQuery({
    queryKey: ["monthlyWorkRecords", yearMonth],
    queryFn: async () => {
      const result = await getAllMonthlyWorkRecords(yearMonth);
      return result.data;
    },
  });
};

export const useCreateWorkRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workRecord: WorkRecord) => {
      const result = await createWorkRecord(workRecord);
      if (result) {
        throw new Error("Failed to create work record");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["workRecords", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["monthlyWorkRecords"],
      });
    },
  });
};
