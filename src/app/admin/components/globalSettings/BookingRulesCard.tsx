import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Settings2, BadgeCheck, BadgeX } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const bookingRulesConfig = {
  title: "Booking Rules",
  icon: Calendar,
  options: [
    {
      key: "maxDaysPerBooking",
      label: "Max Days/Booking",
      value: (data) => data?.bookingRules?.maxDaysPerBooking,
      explanation:
        "Maximum number of days allowed for a single vacation booking.",
      suffix: "days",
    },
    {
      key: "maxDaysPerYear",
      label: "Max Days/Year",
      value: (data) => data?.bookingRules?.maxDaysPerYear,
      explanation: "Total number of vacation days allowed per year.",
      suffix: "days",
    },
    {
      key: "maxAdvanceBookingDays",
      label: "Advance Booking",
      value: (data) => data?.bookingRules?.maxAdvanceBookingDays,
      explanation: "How far in advance employees can schedule their vacations.",
      suffix: "days",
    },
    {
      key: "minDaysNotice",
      label: "Notice Required",
      value: (data) => data?.bookingRules?.minDaysNotice?.days,
      explanation: "Required notice period before vacation can start.",
      suffix: "days",
    },
  ],
};

const BookingRulesCard = ({ data, onEdit }) => {
  const Icon = bookingRulesConfig.icon;

  return (
    <Card className="group bg-slate-50 border-2  border-blue-50 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-orange-500" />
            <div className="flex items-center space-x-2">
              <CardTitle className="text-lg font-bold text-gray-800">
                {bookingRulesConfig.title}
              </CardTitle>
              <div
                className={`flex items-center px-2 py-1 rounded-full ${
                  data?.bookingRules?.minDaysNotice?.enabled
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {data?.bookingRules?.minDaysNotice?.enabled ? (
                  <BadgeCheck className="w-4 h-4 mr-1.5" />
                ) : (
                  <BadgeX className="w-4 h-4 mr-1.5" />
                )}
                <span className="text-xs font-semibold">
                  {data?.bookingRules?.minDaysNotice?.enabled
                    ? "Aktyvus"
                    : "Neaktivus"}
                </span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 text-sm group-hover:opacity-100 bg-lcoffe transition-all duration-300 hover:bg-dcoffe"
            onClick={() => onEdit("bookingRules")}
          >
            <Settings2 className="w-2 h-2" />
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2 grid grid-cols-2 gap-2">
        {bookingRulesConfig.options.map((option) => (
          <HoverCard key={option.key} openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-help">
                <div className="text-sm font-semibold text-gray-900">
                  {option.label}
                </div>
                <div className="font-semibold text-db mt-1">
                  {option.value(data)} {option.suffix}
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
                  {option.label}:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {option.explanation}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </CardContent>
    </Card>
  );
};

export default BookingRulesCard;
