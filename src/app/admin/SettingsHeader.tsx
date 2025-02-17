import React from "react";
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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader, LucideIcon } from "lucide-react";

interface SettingHeaderProps {
  users: User[];
  selectedUserId: string;
  onUserChange: (value: string) => void;
  title: string;
  defaultOption?: {
    id: string;
    label: string;
    badgeText: string;
  };
  children?: React.ReactNode
  selectPlaceholder?: string;
  usersLabel?: string;
  className?: string;
  isLoading?: boolean;
  icon?: {
    Icon: LucideIcon;
    onClick?: () => void;
    className?: string;
  };
}

export function SettingHeader({
  users,
  selectedUserId,
  onUserChange,
  title,
  isLoading,
  icon,
  defaultOption = {
    id: "global",
    label: "Global Settings",
    badgeText: "Global Settings",
  },
  selectPlaceholder = "Select user",
  usersLabel = "Users",
  children,
  className = "",
}: SettingHeaderProps) {
  const currentUser = users.find((user) => user.userId === selectedUserId);
  const isDefaultOption = selectedUserId === defaultOption.id;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row bg-slate-50 border-2 border-blue-50 shadow-md items-center rounded-lg justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-4">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <div className="flex items-center">
              <Badge
                variant={!isDefaultOption ? "outline" : "default"}
                className={
                  !isDefaultOption
                    ? `bg-white px-0 py-0 border-0`
                    : "bg-neutral-700 text-white border-neutral-200"
                }
              >
                {isDefaultOption && defaultOption.badgeText}
              </Badge>
              {currentUser && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-white"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentUser.color }}
                  />
                  {currentUser.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div>{children}</div>

        <div className="flex items-center gap-4">
          {(isLoading || icon) && (
            <div className="flex items-center justify-center">
              {isLoading ? (
                <Loader className="text-gray-800 animate-spin" />
              ) : icon ? (
                <icon.Icon
                  className={
                    icon.className ||
                    "text-db p-1 rounded-md w-10 h-8 bg-lcoffe cursor-pointer hover:text-gray-600 hover:bg-dcoffe transition-colors duration-200"
                  }
                  onClick={icon.onClick}
                />
              ) : null}
            </div>
          )}

          <Select onValueChange={onUserChange} value={selectedUserId}>
            <SelectTrigger className="w-[280px] bg-white border-dcoffe focus:ring-1 focus:ring-vdcoffe border outline-none focus:outline-none ring-lcoffe">
              {selectedUserId ? (
                isDefaultOption ? (
                  <span className="text-sm font-medium">
                    {defaultOption.label}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: currentUser?.color,
                      }}
                    />
                    <span className="text-sm">{currentUser?.email}</span>
                  </div>
                )
              ) : (
                <SelectValue placeholder={selectPlaceholder} />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={defaultOption.id}>
                  {defaultOption.label}
                </SelectItem>
                <SelectLabel className="mt-2">{usersLabel}</SelectLabel>
                {users.map((user) => (
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
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
    </Card>
  );
}
