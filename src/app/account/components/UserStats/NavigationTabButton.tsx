import React from "react";
import { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

interface NavButtonProps {
  icon: LucideIcon;
  isActive?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  disabled?: boolean;
  actionColor?: string;
}

const NavButton = ({
  icon: Icon,
  isActive = false,
  isLoading = false,
  onClick,
  onMouseEnter,
  disabled = false,
  actionColor = "bg-blue-100",
}: NavButtonProps) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled || isLoading}
      className={`p-2 rounded-lg transition-colors ${
        isActive ? actionColor : `bg-[#fefaf6] hover:${actionColor}`
      } ${disabled || isLoading ? "opacity-50" : ""}`}
    >
      {isLoading ? (
        <Loader2 size={24} className="text-gray-800 animate-spin" />
      ) : (
        <Icon size={24} className="text-gray-800" />
      )}
    </button>
  );
};

export default NavButton;
