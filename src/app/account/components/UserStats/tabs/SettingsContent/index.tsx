import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/app/types/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import BookingTimeRulesCard from "./BookingTimeRulesCard";
import GapRulesCard from "./GapRulesCard";
import OverlapRulesCard from "./OverlapRulesCard";
import SeasonalRulesCard from "./SeasonalRulesCard";
import VacationRulesCard from "./VacationRulesCard";

interface SettingsContentProps {
  usersData: User[];
}

const SettingsDisplay: React.FC<SettingsContentProps> = ({ usersData }) => {
  const queryClient = useQueryClient();
  const settings = queryClient.getQueryData<GlobalSettingsType>([
    "sanitizedSettings",
  ]);

  if (!settings) {
    return <div>Loading settings...</div>;
  }

  const getWorkingDaysDescription = () => {
    const { restriction } = settings.restrictedDays.weekends;
    switch (restriction) {
      case "all":
        return "Savaitgaliai įskaičiuojami į darbo dienas";
      case "saturday-only":
        return "Šeštadienis įskaičiuojamas į darbo dienas";
      case "sunday-only":
        return "Sekmadienis įskaičiuojamas į darbo dienas";
      case "none":
        return "Savaitgaliai neįskaičiuojami į darbo dienas";
      default:
        return "Standartinės 5 darbo dienos";
    }
  };

  const usersWhoCanBeOverlapped =
    settings.overlapRules.canIgnoreOverlapRulesOf
      ?.map((userId) => usersData.find((user) => user.userId === userId))
      .filter((user): user is User => user !== undefined) || [];

  const usersWhoseGapsCanBeIgnored =
    settings.gapRules.canIgnoreGapsof
      ?.map((userId) => usersData.find((user) => user.userId === userId))
      .filter((user): user is User => user !== undefined) || [];

  return (
    <div className="space-y-6">
      <Alert className="bg-slate-50 border shadow-md border-blue-50 mb-4">
        <AlertDescription>
          <div className="text-base font-medium flex flex-row space-x-4">
            <p>
              <strong>Darbo dienų skaičiavimas:</strong>{" "}
              {getWorkingDaysDescription()}
            </p>
            <p>
              <strong>d.d - </strong>
              Darbo dienos
            </p>
            <p>
              <strong>k.d - </strong> Kalendorinės dienos
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <VacationRulesCard
          maxDaysPerBooking={settings.bookingRules.maxDaysPerBooking}
          maxDaysPerYear={settings.bookingRules.maxDaysPerYear}
          maximumOverdraftDays={
            settings.bookingRules.overdraftRules.maximumOverdraftDays
          }
          useStrict={settings.bookingRules.overdraftRules.useStrict}
        />

        <BookingTimeRulesCard
          maxAdvanceBookingDays={settings.bookingRules.maxAdvanceBookingDays}
          minDaysNotice={settings.bookingRules.minDaysNotice}
        />
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <OverlapRulesCard
          maxSimultaneousBookings={
            settings.overlapRules.maxSimultaneousBookings
          }
          usersWhoCanBeOverlapped={usersWhoCanBeOverlapped}
        />

        <GapRulesCard
          daysForGapType={settings.gapRules.daysForGap.dayType}
          minimumDaysType={settings.gapRules.minimumDaysForGap.dayType}
          minimumDaysForGap={settings.gapRules.minimumDaysForGap.days}
          daysForGap={settings.gapRules.daysForGap.days}
          usersWhoseGapsCanBeIgnored={usersWhoseGapsCanBeIgnored}
        />
      </div>
      {settings.seasonalRules.enabled &&
        (settings.seasonalRules.blackoutPeriods.length > 0 ||
          settings.seasonalRules.preferredPeriods.length > 0) && (
          <SeasonalRulesCard
            blackoutPeriods={settings.seasonalRules.blackoutPeriods}
            preferredPeriods={settings.seasonalRules.preferredPeriods}
          />
        )}
    </div>
  );
};

export default SettingsDisplay;
