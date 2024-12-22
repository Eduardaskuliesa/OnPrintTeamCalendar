import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import {
  updateBookingRules,
  updateGapRules,
  updateOverlapRules,
  updateRestrictedDays,
  updateSeasonalRules,
  updateSettingEnabled,
} from "../updateGlobalSettings";

// Hook for quick enable/disable toggles
export const useUpdateSettingEnabled = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      settingKey,
      enabled,
    }: {
      settingKey: keyof GlobalSettingsType;
      enabled: boolean;
    }) => {
      const result = await updateSettingEnabled(settingKey, enabled);
      if (!result.success) {
        throw new Error(result.error || "Failed to update status");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
    },
  });
};

// Hook for gap rules updates
export const useUpdateGapDays = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (days: number) => {
      const result = await updateGapRules({days: days});
      if (!result.success) {
        throw new Error(result.error || "Failed to update gap days");
      }
      return result;
    },

    onSuccess: (result) => {
      queryClient.setQueryData(
        ["getGlobalSettings"],
        (oldData: GlobalSettingsType) => ({
          ...oldData,
          data: result.data,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
    },
  });
};

export const useUpdateOverlapRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (people: number) => {
      const result = await updateOverlapRules(people);
      if (!result.success) {
        throw new Error(result.error || "Failed to update gap days");
      }
      return result;
    },

    onSuccess: (result) => {
      queryClient.setQueryData(
        ["getGlobalSettings"],
        (oldData: GlobalSettingsType) => ({
          ...oldData,
          data: result.data,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
    },
  });
};

export const useUpdateBookingRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRules: {
      enabled: boolean;
      maxDaysPerBooking: number;
      maxDaysPerYear: number;
      maxAdvanceBookingDays: number;
      minDaysNotice: number;
    }) => {
      const result = await updateBookingRules(bookingRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update booking rules");
      }
      return result;
    },

    onSuccess: (result) => {
      queryClient.setQueryData(
        ["getGlobalSettings"],
        (oldData: GlobalSettingsType) => ({
          ...oldData,
          data: result.data,
        })
      );
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
    },
  });
};

export const useUpdateSeasonalRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (seasonalRules: {
      enabled: boolean;
      blackoutPeriods: GlobalSettingsType["seasonalRules"]["blackoutPeriods"];
      preferredPeriods: GlobalSettingsType["seasonalRules"]["preferredPeriods"];
    }) => {
      const result = await updateSeasonalRules(seasonalRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update seasonal rules");
      }
      return result;
    },

    onSuccess: (result) => {
      // Update the cached data optimistically
      queryClient.setQueryData(
        ["getGlobalSettings"],
        (oldData: GlobalSettingsType) => ({
          ...oldData,
          data: result.data,
        })
      );
      // Invalidate and refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
    },
  });
};

export const useUpdateRestrictedDays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      restrictedDays: GlobalSettingsType["restrictedDays"]
    ) => {
      const result = await updateRestrictedDays(restrictedDays);
      if (!result.success) {
        throw new Error(result.error || "Failed to update restricted days");
      }
      return result;
    },

    onSuccess: (result) => {
      queryClient.setQueryData(["getGlobalSettings"], (oldData: any) => ({
        ...oldData,
        data: result.data,
      }));
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
    },
  });
};
