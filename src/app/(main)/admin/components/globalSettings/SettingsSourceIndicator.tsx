import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Globe2, User2, Loader2 } from "lucide-react";

interface SettingsSourceIndicatorProps {
  isGlobalSettings: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isPending: boolean;
}

const SettingsSourceIndicator = ({
  isGlobalSettings,
  isPending,
  onToggle,
  disabled = false,
}: SettingsSourceIndicatorProps) => {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <button
          onClick={onToggle}
          disabled={disabled || isPending}
          className={`flex items-center px-2 py-1 rounded-full transition-all duration-200 ${
            disabled || isPending
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-opacity-80"
          } ${
            isGlobalSettings
              ? "bg-violet-50 text-violet-600 hover:bg-violet-100"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isGlobalSettings ? (
            <Globe2 className="w-4 h-4" />
          ) : (
            <User2 className="w-4 h-4" />
          )}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        side="bottom"
        className="w-auto px-2 py-1 bg-white border border-slate-200 shadow-lg"
      >
        <div className="space-y-1">
          <p className="text-[0.8rem] font-semibold text-gray-700">
            {isGlobalSettings ? "Bendri nustatymai" : "Vartotojo nustatymai"}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SettingsSourceIndicator;
