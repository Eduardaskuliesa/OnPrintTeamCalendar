import { GlobalSettingsType } from "@/app/types/bookSettings";

export function sanitizeSettings(
  userSettings: GlobalSettingsType,
  globalSettings: GlobalSettingsType,
  useGlobal: boolean
): GlobalSettingsType {
  if (useGlobal) {
    return globalSettings;
  }

  const mergedSettings: GlobalSettingsType = {
    gapRules: userSettings.useGlobalSettings.gapRules
      ? globalSettings.gapRules
      : userSettings.gapRules,

    bookingRules: userSettings.useGlobalSettings.bookingRules
      ? globalSettings.bookingRules
      : userSettings.bookingRules,

    overlapRules: userSettings.useGlobalSettings.overlapRules
      ? globalSettings.overlapRules
      : userSettings.overlapRules,

    restrictedDays: userSettings.useGlobalSettings.restrictedDays
      ? globalSettings.restrictedDays
      : userSettings.restrictedDays,

    seasonalRules: userSettings.useGlobalSettings.seasonalRules
      ? globalSettings.seasonalRules
      : userSettings.seasonalRules,

    useGlobalSettings: userSettings.useGlobalSettings,
  };

  return mergedSettings;
}
