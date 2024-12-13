import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Sunset, BadgeCheck, BadgeX, Settings2 } from "lucide-react";

const seasonalRulesExplanations = {
  blackoutPeriods: "Time periods when vacations cannot be booked.",
  preferredPeriods: "Suggested time periods for taking vacations.",
};

const SeasonalRulesCard = ({ data, onEdit }) => {
  return (
    <Card className="group bg-slate-50 border-2 border-blue-50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sunset className="w-5 h-5 text-yellow-500" />
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-bold text-gray-800">
                Seasonal Rules
              </CardTitle>
              <div
                className={`flex items-center px-2 py-1 rounded-full ${data?.seasonalRules?.enabled
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-orange-100 text-orange-700"
                  }`}
              >
                {data?.seasonalRules?.enabled ? (
                  <BadgeCheck className="w-4 h-4 mr-1.5" />
                ) : (
                  <BadgeX className="w-4 h-4 mr-1.5" />
                )}
                <span className="text-xs font-semibold">
                  {data?.seasonalRules?.enabled ? "Aktyvus" : "Neaktivus"}
                </span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
            onClick={() => onEdit("seasonalRules")}
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
                  Blackout Periods
                </div>
                <div className="text-lg font-bold text-db mt-1">
                  {data?.seasonalRules?.blackoutPeriods?.length || 0} periods
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
                  Blackout Periods:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {seasonalRulesExplanations.blackoutPeriods}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                <div className="text-sm font-semibold text-gray-900">
                  Preferred Periods
                </div>
                <div className="font-semibold text-db mt-1">
                  {data?.seasonalRules?.preferredPeriods?.length || 0} periods
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
                  Preferred Periods:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {seasonalRulesExplanations.preferredPeriods}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonalRulesCard;