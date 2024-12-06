"use client";

interface AdminTabsProps {
  activeTab: "dashboard" | "requests";
  onTabChange: (tab: "dashboard" | "requests") => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="inline-flex rounded-lg shadow-sm border border-gray-100">
      <button
        onClick={() => onTabChange("dashboard")}
        className={`px-6 py-2 shadow-sm text-sm font-medium rounded-l-lg transition-colors ${
          activeTab === "dashboard"
            ? "bg-lcoffe text-950"
            : "bg-white text-gray-700 hover:text-gray-950"
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => onTabChange("requests")}
        className={`px-6 py-2 text-sm font-medium rounded-r-lg border-l transition-colors ${
          activeTab === "requests"
            ? "bg-lcoffe text-950"
            : "bg-white text-gray-700 hover:text-gray-950"
        }`}
      >
        Užklausos
      </button>
    </div>
  );
}
