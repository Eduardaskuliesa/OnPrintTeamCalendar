import React from "react";
import { Globe2, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsToggleProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}

const SettingsToggle = ({
  enabled,
  onToggle,
  className,
}: SettingsToggleProps) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(!enabled)}
      className={cn(
        "flex items-center px-2 py-1 rounded-full transition-all duration-200",
        enabled
          ? "bg-violet-50 text-violet-600 hover:bg-violet-100"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100",
        className
      )}
    >
      {enabled ? (
        <Globe2 className="w-4 h-4 mr-1.5" />
      ) : (
        <User2 className="w-4 h-4 mr-1.5" />
      )}
      <span className="text-xs font-semibold">
        {enabled ? "Bendrus nustatymus" : "Vartotojo nustatymus"}
      </span>
    </button>
  );
};

export default SettingsToggle;
