import React from "react";
import { Calendar, HelpCircle, ArrowRight } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface Period {
  name: string;
  start: string;
  end: string;
  reason?: string;
}

interface SeasonalRulesCardProps {
  blackoutPeriods: Period[];
  preferredPeriods: Period[];
}

const SeasonalRulesCard = ({
  blackoutPeriods,
  preferredPeriods,
}: SeasonalRulesCardProps) => {
  const wrapperClassName = preferredPeriods.length === 0 ? "w-1/2" : "w-full";

  return (
    <div className={wrapperClassName}>
      <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="group">
                  <Calendar className="w-4 h-4 text-db group-hover:hidden" />
                  <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Apriboti ir rekomenduojami atostogų periodai</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h3 className="text-lg font-semibold text-db">
              Sezoninės taisyklės
            </h3>
          </div>
        </div>

        <div className={preferredPeriods.length > 0 ? "flex gap-6" : ""}>
          {blackoutPeriods.length > 0 && (
            <div className="flex-1">
              <h4 className="text-base font-medium mb-3 text-db">
                Rezervacija apribota:
              </h4>
              <div className="space-y-2 max-h-[170px] overflow-y-auto custom-scrollbar pr-2">
                {blackoutPeriods.map((period, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-slate-50 rounded-md border-2 border-blue-50 border-l-rose-500 border-l-4 hover:bg-opacity-80 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2 text-gray-800">
                      <span className="text-base font-medium">
                        {period.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {format(new Date(period.start), "LLL d, yyyy")}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(period.end), "LLL d, yyyy")}
                      </span>
                      {period.reason && (
                        <span className="text-sm text-gray-600">
                          {period.reason}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {preferredPeriods.length > 0 && (
            <div className="flex-1">
              <h4 className="text-base font-medium mb-3 text-db">
                Rekomenduojami periodai:
              </h4>
              <div className="space-y-2 max-h-[170px] overflow-y-auto custom-scrollbar pr-2">
                {preferredPeriods.map((period, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-slate-50 rounded-md border-2 border-blue-50 border-l-emerald-500 border-l-4 hover:bg-opacity-80 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-2 text-gray-800">
                      <span className="text-base font-medium">
                        {period.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {format(new Date(period.start), "LLL d, yyyy")}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(period.end), "LLL d, yyyy")}
                      </span>
                      {period.reason && (
                        <span className="text-sm text-gray-600">
                          {period.reason}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {blackoutPeriods.length === 0 && preferredPeriods.length === 0 && (
            <div className="text-center py-6 text-gray-600">
              Nėra nustatytų periodinių taisyklių
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonalRulesCard;
