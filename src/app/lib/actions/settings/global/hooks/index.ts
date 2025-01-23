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
import { updateEmails } from "../updateAdminEmails";

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
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateGapDays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gapRules: {
      daysForGap: GlobalSettingsType["gapRules"]["daysForGap"];
      minimumDaysForGap: GlobalSettingsType["gapRules"]["minimumDaysForGap"];
    }) => {
      const result = await updateGapRules(gapRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update gap rules");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateBookingRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingRules: {
      maxDaysPerBooking: GlobalSettingsType["bookingRules"]["maxDaysPerBooking"];
      maxDaysPerYear: GlobalSettingsType["bookingRules"]["maxDaysPerYear"];
      maxAdvanceBookingDays: GlobalSettingsType["bookingRules"]["maxAdvanceBookingDays"];
      minDaysNotice: GlobalSettingsType["bookingRules"]["minDaysNotice"];
      overdraftRules: GlobalSettingsType["bookingRules"]["overdraftRules"];
    }) => {
      const result = await updateBookingRules(bookingRules);
      if (!result.success) {
        throw new Error(result.error || "Failed to update booking rules");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};

export const useUpdateEmails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (emails: {
      admin: GlobalSettingsType["emails"]["admin"];
      accountant: GlobalSettingsType["emails"]["accountant"];
      founderNameSurname: GlobalSettingsType["emails"]["founderNameSurname"];
    }) => {
      const result = await updateEmails(emails);
      if (!result.success) {
        throw new Error(result.error || "Failed to update emails");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGlobalSettings"] });
      queryClient.invalidateQueries({ queryKey: ["sanitizedSettings"] });
    },
  });
};
