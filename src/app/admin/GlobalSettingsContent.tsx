"use client";
import React, { useState } from "react";
import { Bounce, toast } from "react-toastify";
import { GlobalSettingsType } from "../types/bookSettings";
import { useGlobalSettings } from "../lib/actions/useGetSettings";
import { useUserSettings } from "../lib/actions/settings/user/hooks";
import { AlertTriangle, Check, Mail, X } from "lucide-react";
import BookingRulesCard from "./components/globalSettings/BookingRulesCard";
import GapRulesCard from "./components/globalSettings/GapRulesCard";
import OverlapRulesCard from "./components/globalSettings/OverlapRulesCard";
import RestrictedDaysCard from "./components/globalSettings/RestrictedDaysCard";
import SeasonalRulesCard from "./components/globalSettings/SeasonalRules";
import GlobalSettingsLoader from "./GlobalSettingsLoader";
import { User } from "@/app/types/api";
import { SettingHeader } from "./SettingsHeader";
import { UpdateAdminModal } from "./components/globalSettings/UpdateAdminModal";

interface GlobalSettingsProps {
  users: User[];
  selectedUser?: User | null;
  onUserUpdated: (updatedUser: User) => void;
}

const GlobalSettingsContent = ({
  users: initialUsers,
  selectedUser,
}: GlobalSettingsProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    selectedUser?.userId || "global"
  );

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<{
    [key: string]: {
      hasChanges: boolean;
      saveHandler?: () => Promise<void>;
      cancelHandler?: () => void;
    };
  }>({});
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const { data: globalData, isLoading: isGlobalLoading } = useGlobalSettings();
  const { data: userData, isLoading: isUserLoading } = useUserSettings(
    selectedUserId !== "global" ? selectedUserId : null
  );

  const currentData = selectedUserId === "global" ? globalData : userData;
  const isLoading =
    selectedUserId === "global" ? isGlobalLoading : isUserLoading;

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

  return (
    <div key={selectedUserId} className="space-y-6">
      <SettingHeader
        users={initialUsers}
        selectedUserId={selectedUserId}
        onUserChange={handleUserChange}
        title="Atostogų Nustatymai"
        defaultOption={{
          id: "global",
          label: "Global Settings",
          badgeText: "Global Settings",
        }}
        usersLabel="Users"
        isLoading={isGlobalLoading}
        icon={{
          Icon: Mail,
          onClick: () => setIsEmailModalOpen(true),
        }}
      />

      {isLoading ? (
        <GlobalSettingsLoader></GlobalSettingsLoader>
      ) : (
        <>
          <BookingRulesCard
            globalData={globalData?.data as GlobalSettingsType}
            userData={currentData?.data as GlobalSettingsType}
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

          <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
            <GapRulesCard
              globalData={globalData?.data as GlobalSettingsType}
              userData={currentData?.data as GlobalSettingsType}
              users={initialUsers as User[]}
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
              users={initialUsers as User[]}
              selectedUserId={selectedUserId}
              globalData={globalData?.data as GlobalSettingsType}
              userData={currentData?.data as GlobalSettingsType}
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

          <div className="grid grid-cols-1  lg:grid-cols-2 gap-6">
            <SeasonalRulesCard
              selectedUserId={selectedUserId}
              globalData={globalData?.data as GlobalSettingsType}
              userData={currentData?.data as GlobalSettingsType}
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
              globalData={globalData?.data as GlobalSettingsType}
              userData={currentData?.data as GlobalSettingsType}
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
          {isEmailModalOpen && globalData?.data && (
            <UpdateAdminModal
              isOpen={isEmailModalOpen}
              onClose={() => setIsEmailModalOpen(false)}
              initialData={globalData.data.emails}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GlobalSettingsContent;
