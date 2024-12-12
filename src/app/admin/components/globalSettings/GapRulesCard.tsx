import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Settings2, BadgeCheck, BadgeX } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const gapRulesExplanations = {
  minimumGap:
    "Required waiting period between two vacation bookings to ensure work continuity.",
};

const GapRulesCard = ({ data, onEdit }) => {
  return (
    <Card className="group bg-slate-50 border-2 border-blue-50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-bold text-gray-800">
                Gap Rules
              </CardTitle>
              <div
                className={`flex items-center px-2 py-1 rounded-full ${
                  data?.gapRules?.enabled
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {data?.gapRules?.enabled ? (
                  <BadgeCheck className="w-4 h-4 mr-1.5" />
                ) : (
                  <BadgeX className="w-4 h-4 mr-1.5" />
                )}
                <span className="text-xs font-semibold">
                  {data?.gapRules?.enabled ? "Aktyvus" : "Neaktivus"}
                </span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
            onClick={() => onEdit("gapRules")}
          >
            <Settings2 className="w-2 h-2" />
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
              <div className="text-sm font-semibold text-gray-900">
                Minimum Gap
              </div>
              <div className="font-semibold text-db mt-1">
                {data?.gapRules?.days} days
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
                Minimum Gap Rule:
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {gapRulesExplanations.minimumGap}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardContent>
    </Card>
  );
};

export default GapRulesCard;