import React from "react";
import { Users, Calendar, Palmtree, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type TabType = "dashboard" | "pending" | "active" | "settings";

interface AdminTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingCount: number;
  activeCount: number;
}

const AdminTabs = ({
  activeTab,
  onTabChange,
  pendingCount,
  activeCount,
}: AdminTabsProps) => {
  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Users className="w-4 h-4 text-blue-500" />,
      count: null,
    },
    {
      id: "pending",
      label: "Laukia patvirtinimo",
      icon: <Calendar className="w-4 h-4 text-orange-500" />,
      count: pendingCount,
    },
    {
      id: "active",
      label: "Atostogauja",
      icon: <Palmtree className="w-4 h-4 text-green-500" />,
      count: activeCount,
    },
    {
      id: "settings",
      label: "Nustatymai",
      icon: <Settings className="w-4 h-4 text-gray-500" />,
      count: null,
    },
  ];

  return (
    <TooltipProvider>
      <div className="inline-flex bg-slate-100 border border-blue-50 rounded-lg p-1 gap-1">
        {tabs.map((tab) => (
          <Tooltip key={tab.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabChange(tab.id as TabType)}
                className={`
                  flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }
                `}
                aria-label={tab.label}
              >
                <span className="mr-1.5 lg:mr-0">{tab.icon}</span>
                <span className="hidden lg:inline">{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span
                    className={`
                    ml-1.5 text-xs py-0.5 px-1.5 rounded-full
                    ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="md:hidden">
              {tab.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default AdminTabs;
