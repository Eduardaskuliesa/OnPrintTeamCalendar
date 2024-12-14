"use client";
import React, { useState } from "react";
import EditModal from "./components/globalSettings/EditModal";
import { useGlobalSettings } from "../lib/actions/useGetSettings";
import BookingRulesCard from "./components/globalSettings/BookingRulesCard";
import GapRulesCard from "./components/globalSettings/GapRulesCard";
import OverlapRulesCard from "./components/globalSettings/OverlapRulesCard";
import RestrictedDaysCard from "./components/globalSettings/RestrictedDaysCard";
import SeasonalRulesCard from "./components/globalSettings/SeasonalRules";
import GlobalSettingsLoader from "./GlobalSettingsLoader";

const GlobalSettings = () => {
  const { data, isLoading } = useGlobalSettings();
  const [editingSection, setEditingSection] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (isLoading) {
    return <GlobalSettingsLoader />;
  }

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleResetSettings = () => {
    setShowResetConfirm(true);
  };

  return (
    <div className="space-y-4">
      <div className="px-4 py-2 max-w-[250px] bg-slate-50 border-2 border-blue-50 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Atostogų Nustatymai
            </h3>
          </div>
        </div>
      </div>
      <BookingRulesCard data={data?.data} onEdit={handleEdit} />
      <div className="grid grid-cols-2 gap-6">
        <GapRulesCard data={data?.data} onEdit={handleEdit} />
        <OverlapRulesCard data={data?.data} onEdit={handleEdit} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SeasonalRulesCard data={data?.data} onEdit={handleEdit} />
        <RestrictedDaysCard data={data?.data} onEdit={handleEdit} />
      </div>

      {editingSection && (
        <EditModal
          section={editingSection}
          isOpen={true}
          onClose={() => setEditingSection(null)}
          initialValues={data?.data[editingSection]}
          onSave={(values) => handleUpdate(editingSection, values)}
        />
      )}
    </div>
  );
};

export default GlobalSettings;
