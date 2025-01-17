import React from "react";
import { Clock, AlertCircle, Calendar, HelpCircle } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface VacationRulesCardProps {
  maxDaysPerYear: {
    days: number;
    dayType: "working" | "calendar";
  };
  maxDaysPerBooking: {
    days: number;
    dayType: "working" | "calendar";
  };
  maximumOverdraftDays: number;
  useStrict: boolean;
}

const VacationRulesCard: React.FC<VacationRulesCardProps> = ({
  maxDaysPerYear,
  maxDaysPerBooking,
  maximumOverdraftDays,
  useStrict,
}) => {
  const getDayTypeLabel = (type: "working" | "calendar") => {
    return type === "working" ? "d.d." : "k.d.";
  };

  return (
    <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-db">
          Atostogų kredito taisyklės
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-vdcoffe">
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="group">
                  <Calendar className="w-4 h-4 text-db group-hover:hidden" />
                  <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maksimalus atostogų dienų skaičius per metus</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-medium text-db">
              Limitas per metus
            </span>
          </div>
          <span className="text-base font-semibold text-db">
            {maxDaysPerYear.days} {getDayTypeLabel(maxDaysPerYear.dayType)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-vdcoffe">
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="group">
                  <Clock className="w-4 h-4 text-db group-hover:hidden" />
                  <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Maksimalus dienų skaičius viename rezervavime</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-medium text-db">
              Vieno rezervavimo limitas
            </span>
          </div>
          <span className="text-base font-semibold text-db">
            {maxDaysPerBooking.days}{" "}
            {getDayTypeLabel(maxDaysPerBooking.dayType)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="group">
                  <AlertCircle className="w-4 h-4 text-db group-hover:hidden" />
                  <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Galimybė rezervuoti atostogas neturint pakankamai dienų</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-medium text-db">Kreditas</span>
          </div>
          <span className="text-base font-semibold text-db">
            {useStrict
              ? "Negalima eiti į minusą"
              : maximumOverdraftDays > 0
              ? `Iki ${maximumOverdraftDays} d.d.`
              : "Nėra"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VacationRulesCard;
