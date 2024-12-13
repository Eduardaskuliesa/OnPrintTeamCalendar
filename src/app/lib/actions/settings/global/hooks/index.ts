import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GlobalSettings } from "@/app/types/bookSettings";
import {
    updateGapRules,
    updateBookingRules,
    updateOverlapRules,
    updateRestrictedDays,
    updateSeasonalRules,
    updateSettingEnabled,
    updateMinDaysNotice
} from '../updateGlobalSettings';

// Hook for quick enable/disable toggles
export const useUpdateSettingEnabled = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ settingKey, enabled }: {
        settingKey: keyof GlobalSettings;
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
      }
    });
  };

// Hook for gap rules updates
export const useUpdateGapRules = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (gapRules: GlobalSettings['gapRules']) =>
            updateGapRules(gapRules),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
        },
    });
};

// Hook for booking rules updates
export const useUpdateBookingRules = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingRules: GlobalSettings['bookingRules']) =>
            updateBookingRules(bookingRules),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
        },
    });
};

// Hook for overlap rules updates
export const useUpdateOverlapRules = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (overlapRules: GlobalSettings['overlapRules']) =>
            updateOverlapRules(overlapRules),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
        },
    });
};

// Hook for restricted days updates
export const useUpdateRestrictedDays = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (restrictedDays: GlobalSettings['restrictedDays']) =>
            updateRestrictedDays(restrictedDays),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
        },
    });
};

// Hook for seasonal rules updates
export const useUpdateSeasonalRules = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (seasonalRules: GlobalSettings['seasonalRules']) =>
            updateSeasonalRules(seasonalRules),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
        },
    });
};

// Hook for minimum days notice updates
export const useUpdateMinDaysNotice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (minDaysNotice: GlobalSettings['bookingRules']['minDaysNotice']) =>
            updateMinDaysNotice(minDaysNotice),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
        },
    });
};