"use client";
import React, { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { GlobalSettingsType } from "../types/bookSettings";
import { useGlobalSettings } from "../lib/actions/useGetSettings";
import { useUserSettings } from "../lib/actions/settings/user/hooks";
import { AlertTriangle, Check, X } from "lucide-react";
import BookingRulesCard from "./components/globalSettings/BookingRulesCard";
import GapRulesCard from "./components/globalSettings/GapRulesCard";
import OverlapRulesCard from "./components/globalSettings/OverlapRulesCard";
import RestrictedDaysCard from "./components/globalSettings/RestrictedDaysCard";
import SeasonalRulesCard from "./components/globalSettings/SeasonalRules";
import GlobalSettingsLoader from "./GlobalSettingsLoader";
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

interface GlobalSettingsProps {
  users: User[];
  selectedUser?: User | null;
}

const GlobalSettings = ({ users, selectedUser }: GlobalSettingsProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    selectedUser?.email || "global"
  );
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<{
    [key: string]: {
      hasChanges: boolean;
      saveHandler?: () => Promise<void>;
      cancelHandler?: () => void;
    };
  }>({});

  const { data: globalData, isLoading: isGlobalLoading } = useGlobalSettings();
  const { data: userData, isLoading: isUserLoading } = useUserSettings(
    selectedUserId !== "global" ? selectedUserId : null
  );

  const currentData = selectedUserId === "global" ? globalData : userData;
  const isLoading =
    selectedUserId === "global" ? isGlobalLoading : isUserLoading;

  console.log(currentData?.data?.settingId);

  const handleEdit = (section: string) => {
    if (editingSection && unsavedChanges[editingSection]?.hasChanges) {
      const toastId = toast(
        <div className="flex items-center">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800">
              <p className="flex items-center">
                <AlertTriangle size={20} className="mr-2 text-yellow-600" />
                Unsaved Changes
              </p>
            </h3>
            <div className="w-full h-0.5 bg-gray-300 mb-2"></div>
            <p className="text text-gray-600 mb-2">Isaugogite preita laukeli</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  unsavedChanges[editingSection]?.cancelHandler?.();
                  setEditingSection(section);
                  toast.dismiss(toastId);
                }}
                className="flex items-center justify-center bg-rose-200 hover:bg-rose-300 text-red-800 px-2 py-2 rounded-lg transition-colors duration-300 space-x-2 text-sm font-medium"
              >
                <X size={16} />
              </button>
              <button
                onClick={async () => {
                  try {
                    await unsavedChanges[editingSection]?.saveHandler?.();
                    setEditingSection(section);
                    toast.dismiss(toastId);
                  } catch (error) {
                    console.error("Error saving changes", error);
                    toast.error("Failed to save changes");
                  }
                }}
                className="flex items-center justify-center bg-emerald-200 hover:bg-emerald-300 text-emerald-800 px-2 py-2 rounded-lg transition-colors duration-300 space-x-2 text-sm font-medium"
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        </div>,
        {
          position: "bottom-center",
          className:
            "bg-gray-200 border-l-[4px] border-yellow-600 shadow-lg py-1 px-2",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          icon: false,
          transition: Bounce,
        }
      );
      return;
    }
    setEditingSection(section);
  };

  const handleUpdateUnsavedChanges = (
    section: string,
    hasChanges: boolean,
    saveHandler?: () => Promise<void>,
    cancelHandler?: () => void
  ) => {
    setUnsavedChanges((prev) => ({
      ...prev,
      [section]: {
        hasChanges,
        saveHandler,
        cancelHandler,
      },
    }));
  };

  const handleCancelEdit = (section: string) => {
    setEditingSection(null);
    setUnsavedChanges((prev) => ({
      ...prev,
      [section]: { hasChanges: false },
    }));
  };

  const handleUserChange = (value: string) => {
    if (editingSection && unsavedChanges[editingSection]?.hasChanges) {
      toast.warn("Please save or cancel your changes before switching users");
      return;
    }
    setSelectedUserId(value);
  };

  const currentUser = users.find((user) => user.email === selectedUserId);
  const isGlobalSettings = selectedUserId === "global";

  return (
    <div key={selectedUserId} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <div className="space-y-1">
              <CardTitle>Atostogų Nustatymai</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={!isGlobalSettings ? "secondary" : "default"}>
                  {!isGlobalSettings ? "User Settings" : "Global Settings"}
                </Badge>
                {currentUser && (
                  <Badge variant="outline" className="flex items-center gap-1">
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

          <Select onValueChange={handleUserChange} value={selectedUserId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select user settings to manage" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Global</SelectLabel>
                <SelectItem value="global">Global Settings</SelectItem>
                <SelectLabel className="mt-2">Users</SelectLabel>
                {users.map((user) => (
                  <SelectItem key={user.email} value={user.email}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: user.color }}
                      />
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      {isLoading ? (
        <GlobalSettingsLoader></GlobalSettingsLoader>
      ) : (
        <>
          <BookingRulesCard
            data={currentData?.data as GlobalSettingsType}
            selectedUserId={selectedUserId}
            isEditing={editingSection === "bookingRules"}
            onEdit={() => handleEdit("bookingRules")}
            onCancel={() => handleCancelEdit("bookingRules")}
            onUnsavedChanges={(hasChanges, saveHandler, cancelHandler) =>
              handleUpdateUnsavedChanges(
                "bookingRules",
                hasChanges,
                saveHandler,
                cancelHandler
              )
            }
          />

          <div className="grid grid-cols-2 gap-6">
            <GapRulesCard
              data={currentData?.data as GlobalSettingsType}
              isEditing={editingSection === "gapRules"}
              onEdit={() => handleEdit("gapRules")}
              onCancel={() => handleCancelEdit("gapRules")}
              selectedUserId={selectedUserId}
              onUnsavedChanges={(hasChanges, saveHandler, cancelHandler) =>
                handleUpdateUnsavedChanges(
                  "gapRules",
                  hasChanges,
                  saveHandler,
                  cancelHandler
                )
              }
            />
            <OverlapRulesCard
              selectedUserId={selectedUserId}
              data={currentData?.data as GlobalSettingsType}
              isEditing={editingSection === "overlapRules"}
              onEdit={() => handleEdit("overlapRules")}
              onCancel={() => handleCancelEdit("overlapRules")}
              onUnsavedChanges={(hasChanges, saveHandler, cancelHandler) =>
                handleUpdateUnsavedChanges(
                  "overlapRules",
                  hasChanges,
                  saveHandler,
                  cancelHandler
                )
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <SeasonalRulesCard
              selectedUserId={selectedUserId}
              data={currentData?.data as GlobalSettingsType}
              isEditing={editingSection === "seasonalRules"}
              onEdit={() => handleEdit("seasonalRules")}
              onCancel={() => handleCancelEdit("seasonalRules")}
              onUnsavedChanges={(hasChanges, saveHandler, cancelHandler) =>
                handleUpdateUnsavedChanges(
                  "seasonalRules",
                  hasChanges,
                  saveHandler,
                  cancelHandler
                )
              }
            />
            <RestrictedDaysCard
              selectedUserId={selectedUserId}
              data={currentData?.data as GlobalSettingsType}
              isEditing={editingSection === "restrictedDaysRules"}
              onEdit={() => handleEdit("restrictedDaysRules")}
              onCancel={() => handleCancelEdit("restrictedDaysRules")}
              onUnsavedChanges={(hasChanges, saveHandler, cancelHandler) =>
                handleUpdateUnsavedChanges(
                  "restrictedDaysRules",
                  hasChanges,
                  saveHandler,
                  cancelHandler
                )
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GlobalSettings;
