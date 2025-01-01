import { Calendar, Clock, CalendarCheck, CalendarX } from "lucide-react";

interface UserStatsProps {
  totalVacationDays: number;
  usedVacationDays: number;
  pendingRequests: number;
  totalPendingVacationDays: number;
  nextVacation: string | null;
}

export default async function UserStats({
  totalVacationDays,
  usedVacationDays,
  pendingRequests,
  nextVacation,
  totalPendingVacationDays,
}: UserStatsProps) {
  return (
    <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-4">
      <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Likusios dienos
          </h3>
          <div className="bg-green-100 p-2 rounded-lg">
            <Calendar className="text-green-800" size={20} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-3xl font-bold text-green-800">
            {Number(totalVacationDays) % 1 === 0
              ? totalVacationDays
              : Number(totalVacationDays).toFixed(3)}
          </p>
          {totalPendingVacationDays > 0 && (
            <span className="text-green-800 text-2xl mb-1 font-semibold">
              ({totalPendingVacationDays})
            </span>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Panaudotos</h3>
          <div className="bg-blue-100 p-2 rounded-lg">
            <CalendarCheck className="text-db" size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-db">{usedVacationDays}</p>
        <p className="text-sm text-gray-600 mt-1">dienų šiais metais</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Laukia tvirtinimo
          </h3>
          <div className="bg-orange-100 p-2 rounded-lg">
            <Clock className="text-orange-700" size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-orange-700">{pendingRequests}</p>
        <p className="text-sm text-gray-700 mt-1">prašymai nepatvirtinti</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg shadow-md border-2 border-blue-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Kitos atostogos
          </h3>
          <div className="bg-purple-100 p-2 rounded-lg">
            <CalendarX className="text-purple-800" size={20} />
          </div>
        </div>
        <p className="text-3xl font-bold text-purple-800">
          {nextVacation
            ? new Date(nextVacation).toLocaleDateString("lt-LT")
            : "Nėra"}
        </p>
        <p className="text-sm text-gray-700 mt-1">sekančios suplanuotos</p>
      </div>
    </div>
  );
}
