import React, { useState } from "react";
import { BadgeCheck, BadgeX, Loader2, User2, Globe2 } from "lucide-react";
import { updateUserGlobalStatus } from "@/app/lib/actions/users/updateUser";
import { toast } from "react-toastify";
import { User } from "@/app/types/api";

interface StatusToggleProps {
  enabled: boolean;
  isPending: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
}

export const StatusToggle: React.FC<StatusToggleProps> = ({
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

type StatusToggleUserProps = {
  onUserUpdated: (updatedUser: User) => void;
  size?: "sm" | "md" | "lg";
} & (
  | { email: string; users: User[]; user?: never }
  | { user: User; email?: never; users?: never }
);

export const StatusToggleUser: React.FC<StatusToggleUserProps> = (props) => {
  const { onUserUpdated, size = "sm" } = props;

  // Determine the current user based on props
  const currentUser =
    props.user ||
    (props.email && props.users
      ? props.users.find((u) => u.email === props.email)
      : undefined);

  const [isPending, setIsPending] = useState(false);
  const [isGlobalState, setIsGlobalState] = useState(
    currentUser?.useGlobal ?? false
  );

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconClass = sizeClasses[size];

  const handleToggle = async () => {
    if (!currentUser) return;

    setIsPending(true);
    const newState = !isGlobalState;
    setIsGlobalState(newState); // Update UI immediately

    try {
      const result = await updateUserGlobalStatus(currentUser.email, newState);
      if (result.success && result.user) {
        const updatedUser = {
          ...currentUser,
          ...result.user,
          useGlobal: newState,
          updatedAt: new Date().toISOString(),
        };
        onUserUpdated(updatedUser);
        toast.success("Vartotojo statusas buvo pakeistas");
      } else {
        // Revert UI if API call fails
        setIsGlobalState(!newState);
      }
    } catch (error) {
      // Revert UI state on error
      setIsGlobalState(!newState);
      toast.error("Klaida keičiant statusą");
      console.error("Failed to update global status:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (!currentUser) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`flex items-center px-2 py-1 rounded-full transition-all duration-200 cursor-pointer ${
        isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-opacity-80"
      } ${
        isGlobalState
          ? "bg-violet-50 text-violet-600 hover:bg-violet-100"
          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
      }`}
    >
      {isPending ? (
        <Loader2 className={`${iconClass} mr-1.5 animate-spin`} />
      ) : isGlobalState ? (
        <Globe2 className={`${iconClass} mr-1.5`} />
      ) : (
        <User2 className={`${iconClass} mr-1.5`} />
      )}
      <span className="text-xs font-semibold">
        {isPending
          ? "Atnaujinama..."
          : isGlobalState
          ? "Bendri nustatymai"
          : "Vartotojo nustatymai"}
      </span>
    </button>
  );
};

export default StatusToggleUser;
