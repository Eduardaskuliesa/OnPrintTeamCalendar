import { Users, Calendar, Palmtree } from "lucide-react";


interface AdminDashboardStats {
  usersCount: number;
  pendingVacations: number;
  activeVacations: number;
}

export default function AdminDashboardStats({
  usersCount,
  pendingVacations,
  activeVacations,
}: AdminDashboardStats) {
  return (
    <div className="grid grid-cols-1 mb-6 md:grid-cols-3 gap-6">
      <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold">Vartotojai</h3>
          <Users className="text-blue-500" size={20} />
        </div>
        <p className="text-3xl font-bold mt-2">{usersCount}</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold">Laukia patvirtinimo</h3>
          <Calendar className="text-orange-500" size={20} />
        </div>
        <p className="text-3xl font-bold mt-2">{pendingVacations}</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-700 font-semibold">Atostogauja</h3>
          <Palmtree className="text-green-500" size={20} />
        </div>
        <p className="text-3xl font-bold mt-2">{activeVacations}</p>
      </div>
    </div>
  );
}