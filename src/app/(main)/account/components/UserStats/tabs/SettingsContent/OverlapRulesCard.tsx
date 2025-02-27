import React from "react";
import { AlertCircle, HelpCircle } from "lucide-react";
import { User } from "@/app/types/api";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface OverlapRulesCardProps {
  maxSimultaneousBookings: number;
  usersWhoCanBeOverlapped: User[];
}

const OverlapRulesCard: React.FC<OverlapRulesCardProps> = ({
  usersWhoCanBeOverlapped,
}) => {
  // const getEmployeeWord = (count: number) => {
  //   if (count === 1) return "darbuotojas";
  //   return "darbuotojai";
  // };
  return (
    <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-db">
          Vienu metu atostogaujančių taisyklės
        </h3>
      </div>

      <div className="space-y-4">
        {usersWhoCanBeOverlapped.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className="group">
                    <AlertCircle className="w-4 h-4 text-db group-hover:hidden" />
                    <HelpCircle className="w-4 h-4 text-db hidden group-hover:block" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Vartotojai, su kuriais galiu atostogauti vienu metu
                      
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-base font-medium text-db">
                Rezervuoti vienu metu galima:
              </span>
            </div>
            <div className="max-h-[150px]  w-full overflow-auto custom-scrollbar">
              <div className="space-y-2 px-1">
                {usersWhoCanBeOverlapped.map((user) => (
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

export default OverlapRulesCard;
