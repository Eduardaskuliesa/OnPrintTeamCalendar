"use client";

import { useSearchParams, useRouter } from "next/navigation";

export const NavigationTabsSkeleton = () => {
  return (
    <div className="flex">
      <div className="py-2 px-4 bg-slate-50 border-blue-50 border rounded-md mr-1 animate-pulse">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>

      <div className="py-2 px-4 bg-slate-50 border-blue-50 border rounded-md animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

const NavigationTabs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "tags";

  const navigateTo = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`/queues/tags?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex">
      <button
        onClick={() => navigateTo("tags")}
        className={`py-2 px-4 bg-slate-50 border-blue-50 border rounded-md font-medium ${
          currentView === "tags"
            ? "border-b-2 border-b-dcoffe text-db"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Tagai
      </button>
      <button
        onClick={() => navigateTo("rules")}
        className={`py-2 px-4 bg-slate-50 border-blue-50 rounded-md border font-medium ${
          currentView === "rules"
            ? "border-b-2 border-b-dcoffe text-db"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Taisyklės
      </button>
    </div>
  );
};

export default NavigationTabs;
