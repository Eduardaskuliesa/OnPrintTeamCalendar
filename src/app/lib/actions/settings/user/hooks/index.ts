// hooks/useUserSettings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserSettings } from "../getUserSettings";
import {
  createUserSettings,
  updateUserSettingEnabled,
  updateUserBookingRules,
  updateUserOverlapRules,
  updateUserRestrictedDays,
  updateUserSeasonalRules,
  updateUserGapDays,
  updateUserGlobalSettingsPreference,
} from "../updateUserSettings";
import { GlobalSettingsType } from "@/app/types/bookSettings";

export const useCreateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      settings,
    }: {
      userId: string;
      settings: GlobalSettingsType;
    }) => {
      const result = await createUserSettings(userId, settings);
      if (!result.success) {
        throw new Error(result.error || "Failed to create user settings");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateUserSettingEnabled = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      settingKey,
      enabled,
    }: {
      userId: string;
      settingKey: keyof GlobalSettingsType;
      enabled: boolean;
    }) => {
      const result = await updateUserSettingEnabled(
        userId,
        settingKey,
        enabled
      );
      if (!result.success) {
        throw new Error(result.error || "Failed to update status");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateUserGapDays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      gapRules,
    }: {
      userId: string;
      gapRules: GlobalSettingsType["gapRules"];
    }) => {
      const result = await updateUserGapDays(userId, gapRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update gap rules");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateUserOverlapRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      overlapRules,
    }: {
      userId: string;
      overlapRules: GlobalSettingsType["overlapRules"];
    }) => {
      const result = await updateUserOverlapRules(userId, overlapRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update overlap rules");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateUserBookingRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      bookingRules,
    }: {
      userId: string;
      bookingRules: {
        maxDaysPerBooking: GlobalSettingsType["bookingRules"]["maxDaysPerBooking"];
        maxDaysPerYear: GlobalSettingsType["bookingRules"]["maxDaysPerYear"];
        maxAdvanceBookingDays: GlobalSettingsType["bookingRules"]["maxDaysPerBooking"];
        minDaysNotice: GlobalSettingsType["bookingRules"]["minDaysNotice"];
        overdraftRules: GlobalSettingsType["bookingRules"]["overdraftRules"];
      };
    }) => {
      const result = await updateUserBookingRules(userId, bookingRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update booking rules");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateUserSeasonalRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      seasonalRules,
    }: {
      userId: string;
      seasonalRules: {
        enabled: GlobalSettingsType["seasonalRules"]["enabled"];
        blackoutPeriods: GlobalSettingsType["seasonalRules"]["blackoutPeriods"];
        preferredPeriods: GlobalSettingsType["seasonalRules"]["preferredPeriods"];
      };
    }) => {
      const result = await updateUserSeasonalRules(userId, seasonalRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update seasonal rules");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateUserRestrictedDays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      restrictedDays,
    }: {
      userId: string;
      restrictedDays: GlobalSettingsType["restrictedDays"];
    }) => {
      const result = await updateUserRestrictedDays(userId, restrictedDays);
      if (!result.success) {
        throw new Error(result.error || "Failed to update restricted days");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUserSettings = (userId: string | null) => {
  return useQuery({
    queryKey: ["getUserSettings", userId],
    queryFn: () => {
      if (!userId) throw new Error("No user ID provided");
      return getUserSettings(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateUserGlobalSettingsPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      settingKey,
      useGlobal,
    }: {
      userId: string;
      settingKey: keyof GlobalSettingsType;
      useGlobal: boolean;
    }) => {
      const result = await updateUserGlobalSettingsPreference(
        userId,
        settingKey,
        useGlobal
      );
      if (!result.success) {
        throw new Error(
          result.error || "Failed to update global settings preference"
        );
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getUserSettings", variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};
