import React from "react";
import { BadgeCheck, BadgeX, Loader2 } from "lucide-react";

interface StatusToggleProps {
  enabled: boolean;
  isPending: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
}

const StatusToggle: React.FC<StatusToggleProps> = ({
  enabled,
  isPending,
  onToggle,
  size = "sm",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconClass = sizeClasses[size];

  return (
    <button
      onClick={onToggle}
      disabled={isPending}
      className={`flex items-center px-2 py-1 rounded-full transition-colors cursor-pointer ${
        isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-80"
      } ${
        enabled
          ? "bg-emerald-100 text-emerald-600"
          : "bg-orange-100 text-orange-700"
      }`}
    >
      {isPending ? (
        <Loader2 className={`${iconClass} mr-1.5 animate-spin`} />
      ) : enabled ? (
        <BadgeCheck className={`${iconClass} mr-1.5`} />
      ) : (
        <BadgeX className={`${iconClass} mr-1.5`} />
      )}
      <span className="text-xs font-semibold">
        {isPending ? "Atnaujinama..." : enabled ? "Aktyvus" : "Neaktyvus"}
      </span>
    </button>
  );
};

export default StatusToggle;
