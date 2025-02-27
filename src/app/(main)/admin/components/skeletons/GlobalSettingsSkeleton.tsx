import React from "react";

const GlobalSettingsLoader = () => {
  return (
    <div className="space-y-4">
      {/* Booking Rules Card Skeleton */}
      <div className="bg-white p-4 shadow-sm rounded-lg space-y-3 animate-pulse">
        <div className="h-8 bg-gray-300 w-40 rounded-lg"></div>
        <div className="h-6 bg-gray-200 w-48 rounded-lg"></div>
        <div className="h-6 bg-gray-200 w-64 rounded-lg"></div>
      </div>

      {/* Grid Layout for GapRulesCard and OverlapRulesCard */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-sm rounded-lg space-y-3 animate-pulse">
          <div className="h-8 bg-gray-300 w-40 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-48 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-64 rounded-lg"></div>
        </div>
        <div className="bg-white p-4 shadow-sm rounded-lg space-y-3 animate-pulse">
          <div className="h-8 bg-gray-300 w-40 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-48 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-64 rounded-lg"></div>
        </div>
      </div>

      {/* Grid Layout for SeasonalRulesCard and RestrictedDaysCard */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-sm rounded-lg space-y-3 animate-pulse">
          <div className="h-8 bg-gray-300 w-40 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-48 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-64 rounded-lg"></div>
        </div>
        <div className="bg-white p-4 shadow-sm rounded-lg space-y-3 animate-pulse">
          <div className="h-8 bg-gray-300 w-40 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-48 rounded-lg"></div>
          <div className="h-6 bg-gray-200 w-64 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsLoader;
