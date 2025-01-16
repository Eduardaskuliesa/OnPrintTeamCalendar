import React from "react";
import { AlertCircle, Clock, Users, HelpCircle } from "lucide-react";
import { User } from "@/app/types/api";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface GapRulesCardProps {
  minimumDaysForGap: number;
  daysForGap: number;
  minimumDaysType: "working" | "calendar";
  daysForGapType: "working" | "calendar";
  usersWhoseGapsCanBeIgnored: User[];
}

const GapRulesCard: React.FC<GapRulesCardProps> = ({
  minimumDaysForGap,
  daysForGap,
  minimumDaysType,
  daysForGapType,
  usersWhoseGapsCanBeIgnored,
}) => {
  const getDayTypeLabel = (type: "working" | "calendar") => {
    return type === "working" ? "d.d." : "k.d.";
  };

  return (
    <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-db">Tarpo taisyklės</h3>
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
                  <p>Minimalus laikas, kad būtų sukurtas tarpas tarp atostogų periodų</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-medium text-db">
              Min. laikas kad sukurti tarpą
            </span>
          </div>
          <span className="text-base font-semibold text-db">
            {minimumDaysForGap} {getDayTypeLabel(minimumDaysType)}
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
                  <p>Automatiškai sukuriamas tarpas tarp atostogų periodų</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-base font-medium text-db">
              Bus sukurtas tarpas
            </span>
          </div>
          <span className="text-base font-semibold text-db">
            {daysForGap} {getDayTypeLabel(daysForGapType)}
          </span>
        </div>

        {usersWhoseGapsCanBeIgnored.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className="group">
                    <Users className="w-4 h-4 text-db group-hover:hidden" />
                    <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Vartotojai, kurių tarpus galite ignoruoti</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-base font-medium text-db">
                Galiu ignoruoti tarpus:
              </span>
            </div>
            <div className="max-h-[150px] w-full overflow-auto custom-scrollbar">
              <div className="space-y-2 px-1">
                {usersWhoseGapsCanBeIgnored.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-base text-db">
                      {user.name} {user.surname}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GapRulesCard