import { Clock } from "lucide-react";

interface VacationRequest {
  id: string;
  userName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

interface VacationRequestListProps {
  requests: VacationRequest[];
}

export default function VacationRequestList({
  requests,
}: VacationRequestListProps) {
  return (
    <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Atostogų prašymai</h3>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between border-b border-slate-300 py-3 last:border-0"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    request.status === "pending"
                      ? "bg-orange-500"
                      : request.status === "approved"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  <span className="text-white font-medium">
                    {request.userName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{request.userName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">
                      {new Date(request.startDate).toLocaleDateString("lt-LT")}{" "}
                      - {new Date(request.endDate).toLocaleDateString("lt-LT")}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        request.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : request.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status === "pending" && "Laukiama"}
                      {request.status === "approved" && "Patvirtinta"}
                      {request.status === "rejected" && "Atmesta"}
                    </span>
                    <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      <Clock size={14} className="mr-1" />
                      <span className="text-sm font-medium">
                        {Math.ceil(
                          (new Date(request.endDate).getTime() -
                            new Date(request.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        d.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {request.status === "pending" && (
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-emerald-200 text-green-800 rounded-md text-sm shadow-sm hover:bg-emerald-300 transition-colors">
                    Patvirtinti
                  </button>
                  <button className="px-4 py-2 bg-rose-200 text-red-800 rounded-md text-sm shadow-sm hover:bg-rose-300 transition-colors">
                    Atmesti
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
