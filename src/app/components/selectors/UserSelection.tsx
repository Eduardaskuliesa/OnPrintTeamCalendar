// components/shared/selectors/UserSelection.tsx
"use client";

import { User } from "@/app/types/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserSelectionProps {
  selectedUserId: string;
  onUserChange: (userId: string) => void;
  users?: User[];
  isLoadingUsers: boolean;
  label?: string;
  className?: string;
}

const UserSelection = ({
  selectedUserId,
  onUserChange,
  users,
  isLoadingUsers,
  label = "Select User",
  className = "",
}: UserSelectionProps) => {
  const selectedUser = users?.find((u) => u.userId === selectedUserId);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Select onValueChange={onUserChange} value={selectedUserId}>
        <SelectTrigger className="w-full bg-white border-dcoffe focus:ring-1 focus:ring-vdcoffe border outline-none focus:outline-none ring-lcoffe">
          {selectedUserId && users ? (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedUser?.color }}
              />
              <span className="text-sm">{selectedUser?.email}</span>
            </div>
          ) : (
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}s</SelectLabel>
            {isLoadingUsers ? (
              <div className="p-2 text-sm text-gray-500">Loading users...</div>
            ) : users ? (
              users.map((user) => (
                <SelectItem key={user.userId} value={user.userId}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                    <span className="text-sm font-medium">{user.name}</span> -{" "}
                    <span className="">{user.email}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="p-2 text-sm text-red-500">
                Failed to load users
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserSelection;
