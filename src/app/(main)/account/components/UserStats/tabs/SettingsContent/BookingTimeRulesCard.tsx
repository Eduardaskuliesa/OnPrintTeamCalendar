import React from "react";
import { AlertCircle, Clock, HelpCircle } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface BookingRules {
  maxAdvanceBookingDays: {
    days: number;
    dayType: "working" | "calendar";
  };
  minDaysNotice: {
    days: number;
    dayType: "working" | "calendar";
  };
}

const BookingTimeRulesCard: React.FC<BookingRules> = ({
  maxAdvanceBookingDays,
  minDaysNotice,
}) => {
  const getDayTypeLabel = (type: "working" | "calendar") => {
    return type === "working" ? "d.d." : "k.d.";
  };

  return (
    <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-db">
          Rezervavimo laiko taisyklės
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-vdcoffe">
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="group">
                  <Clock className="w-4 h-4 text-db group-hover:hidden" />
                  <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Maksimalus dienų skaičius, kiek toli galima rezervuoti
                    atostogas
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-medium text-db">
              Išankstinis rezervavimas
            </span>
          </div>
          <span className="text-base font-semibold text-db">
            {maxAdvanceBookingDays.days}{" "}
            {getDayTypeLabel(maxAdvanceBookingDays.dayType)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-vdcoffe">
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="group">
                  <AlertCircle className="w-4 h-4 text-db group-hover:hidden" />
                  <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Minimalus dienų skaičius prieš atostogas, kada galima
                    pateikti prašymą
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-medium text-db">
              Rezervacijos pateikimo laikotarpis
            </span>
          </div>
          <span className="text-base font-semibold text-db">
            {minDaysNotice.days} {getDayTypeLabel(minDaysNotice.dayType)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingTimeRulesCard;
