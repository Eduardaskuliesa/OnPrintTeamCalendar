import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Ban, BadgeCheck, BadgeX, Settings2 } from "lucide-react";

const restrictedDaysExplanations = {
  holidays:
    "Dates that are designated as holidays and don't count as vacation days.",
  weekends: "Whether weekend days are counted as part of vacation days.",
  customDates: "Additional dates that are restricted for vacation bookings.",
};

const RestrictedDaysCard = ({ data, onEdit }) => {
  return (
    <Card className="group bg-slate-50 border-2 border-blue-50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ban className="w-5 h-5 text-red-500" />
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-bold text-gray-800">
                Restricted Days
              </CardTitle>
              <div
                className={`flex items-center px-2 py-1 rounded-full ${
                  data?.restrictedDays?.enabled
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {data?.restrictedDays?.enabled ? (
                  <BadgeCheck className="w-4 h-4 mr-1.5" />
                ) : (
                  <BadgeX className="w-4 h-4 mr-1.5" />
                )}
                <span className="text-xs font-semibold">
                  {data?.restrictedDays?.enabled ? "Aktyvus" : "Neaktivus"}
                </span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
            onClick={() => onEdit("restrictedDays")}
          >
            <Settings2 className="w-2 h-2" />
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <div className="grid grid-cols-2 gap-2">
          <HoverCard openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                <div className="text-sm font-semibold text-gray-900">
                  Holidays
                </div>
                <div className="font-semibold text-db mt-1">
                  {data?.restrictedDays?.holidays?.length || 0} days
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              side="bottom"
              className="w-80 px-4 py-2 bg-white border border-blue-100 shadow-lg"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">
                  Holiday Restrictions:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {restrictedDaysExplanations.holidays}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                <div className="text-sm font-semibold text-gray-900">
                  Custom Restricted
                </div>
                <div className="font-semibold text-db mt-1">
                  {data?.restrictedDays?.customRestricted?.length || 0} days
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              side="bottom"
              className="w-80 px-4 py-2 bg-white border border-blue-100 shadow-lg"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">
                  Custom Restricted Days:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {restrictedDaysExplanations.customDates}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <HoverCard openDelay={300} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="px-4 py-2 mt-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
              <div className="text-sm font-semibold text-gray-900">
                Weekends
              </div>
              <div className="font-semibold text-db mt-1">
                {data?.restrictedDays?.weekends ? "Included" : "Excluded"}
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            align="start"
            side="bottom"
            className="w-80 px-4 py-2 bg-white border border-blue-100 shadow-lg"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-700">
                Weekend Policy:
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {restrictedDaysExplanations.weekends}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardContent>
    </Card>
  );
};

export default RestrictedDaysCard;
