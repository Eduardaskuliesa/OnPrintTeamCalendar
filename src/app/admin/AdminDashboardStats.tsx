import { Users, Calendar, Palmtree } from "lucide-react";

interface AdminDashboardStatsProps {
  usersCount: number;
  pendingVacations: number;
  activeVacations: number;
  onNavigate: (tab: "dashboard" | "pending" | "active") => void;
}

export default function AdminDashboardStats({
  usersCount,
  pendingVacations,
  activeVacations,
  onNavigate,
}: AdminDashboardStatsProps) {
  return (
    <div className="hidden md:grid md:grid-cols-3 gap-3 md:gap-6 mb-6">
      <button
        onClick={() => onNavigate("dashboard")}
        className="bg-slate-50 p-4 md:p-6 rounded-lg shadow-md border-2 border-blue-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold text-sm md:text-base">
            Vartotojai
          </h3>
          <Users className="text-blue-500" size={20} />
        </div>
        <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">
          {usersCount}
        </p>
      </button>

      <button
        onClick={() => onNavigate("pending")}
        className="bg-slate-50 p-4 md:p-6 rounded-lg shadow-md border-2 border-blue-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold text-sm md:text-base">
            Laukia patvirtinimo
          </h3>
          <Calendar className="text-orange-500" size={20} />
        </div>
        <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">
          {pendingVacations}
        </p>
      </button>

      <button
        onClick={() => onNavigate("active")}
        className="bg-slate-50 p-4 md:p-6 rounded-lg shadow-md border-2 border-blue-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold text-sm md:text-base">
            Atostogauja
          </h3>
          <Palmtree className="text-green-500" size={20} />
        </div>
        <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">
          {activeVacations}
        </p>
      </button>
    </div>
  );
}
