"use client";
import React from "react";
import {
  CalendarX,
  CloudSun,
  TreePine,
  AlertCircle,
  Flag,
  Ban,
  SunSnow,
  Leaf,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GlobalSettingsType } from "@/app/types/bookSettings";

interface SettingsDisplayProps {
  settings: GlobalSettingsType;
  date: Date;
  viewType?: string;
}

interface IconTooltipProps {
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  content: React.ReactNode;
}
const IconTooltip = ({
  icon,
  bgColor,

  iconColor,
  content,
}: IconTooltipProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`cursor-help hover:scale-105 transition-transform 
            ${bgColor} rounded-full p-1 flex items-center justify-center`}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: `h-4 w-4 ${iconColor}`,
          })}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-[200px] p-1 texst-sm space-y-0.5 ">{content}</div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const SettingsDisplay = ({
  settings,
  date,
  viewType,
}: SettingsDisplayProps) => {
  const activeBlackoutPeriod = settings.seasonalRules.blackoutPeriods.find(
    (period) => {
      const start = new Date(period.start);
      const end = new Date(period.end);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return date >= start && date <= end;
    }
  );

  const activePreferredPeriod = settings.seasonalRules.preferredPeriods.find(
    (period) => {
      const start = new Date(period.start);
      const end = new Date(period.end);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return date >= start && date <= end;
    }
  );

  // Check if date is a holiday
  const isHoliday = settings.restrictedDays.holidays.includes(
    date.toISOString().split("T")[0]
  );

  // Check if date is a custom restricted day
  const isCustomRestricted = settings.restrictedDays.customRestricted.includes(
    date.toISOString().split("T")[0]
  );

  const hasIcons =
    activeBlackoutPeriod ||
    activePreferredPeriod ||
    isHoliday ||
    isCustomRestricted;

  if (viewType === "multiMonthYear") return null;

  if (!hasIcons) return null;

  return (
    <div className="flex items-center absolute top-0 right-0 space-x-1 min-h-[20px]">
      {isHoliday && (
        <IconTooltip
          icon={<Leaf />}
          bgColor="bg-emerald-100"
          iconColor="text-emerald-600"
          content="Šventinė diena"
        />
      )}

      {activePreferredPeriod && (
        <IconTooltip
          icon={<SunSnow />}
          bgColor="bg-sky-100"
          iconColor="text-sky-600"
          content={
            <div className="space-y-0.5">
              <p className="font-medium text-xs">
                {activePreferredPeriod.name}
              </p>
              <p className="text-[0.6rem] text-gray-50">
                {activePreferredPeriod.reason}
              </p>
            </div>
          }
        />
      )}

      {activeBlackoutPeriod && (
        <IconTooltip
          icon={<Ban />}
          bgColor="bg-rose-100"
          iconColor="text-rose-600"
          content={
            <div className="space-y-0.5">
              <p className="font-medium text-xs">{activeBlackoutPeriod.name}</p>
              <p className="text-[0.6rem] text-gray-50">
                {activeBlackoutPeriod.reason}
              </p>
            </div>
          }
        />
      )}

      {isCustomRestricted && (
        <IconTooltip
          icon={<Flag />}
          bgColor="bg-amber-100"
          iconColor="text-amber-600"
          content="Apribota diena"
        />
      )}
    </div>
  );
};

export default SettingsDisplay;
