"use client";

import { Clock, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { updateVacationStatus } from "../lib/actions/vacation";
import { toast } from "react-toastify";

interface Vacation {
  id: string;
  userName: string;
  startDate: string;
  userEmail: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function VacationRequestList({
  initialRequests,
}: {
  initialRequests: Vacation[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [loadingApprove, setLoadingApprove] = useState<string | null>(null);
  const [loadingReject, setLoadingReject] = useState<string | null>(null);

  const handleStatusUpdate = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    userEmail: string
  ) => {
    if (status === "APPROVED") {
      setLoadingApprove(id);
    } else {
      setLoadingReject(id);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const result = await updateVacationStatus(id, status);
      if (result.success) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
        toast.success(
          <span>
            <strong>{userEmail}</strong> atostogos buvo{" "}
            {status === "APPROVED" ? "patvirtintos" : "atmestos"}
          </span>
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(`${error} Klaida`);
    }
    if (status === "APPROVED") {
      setLoadingApprove(null);
    } else {
      setLoadingReject(null);
    }
  };

  return (
    <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Atostogų prašymai</h3>
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Nera jokiu prašymu</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between border-b border-slate-300 py-3 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {request.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{request.userName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">
                        Nuo{" "}
                        <span className="font-semibold">
                          {new Date(request.startDate).toLocaleDateString(
                            "lt-LT"
                          )}{" "}
                        </span>
                        iki{" "}
                        <span className="font-semibold">
                          {new Date(request.endDate).toLocaleDateString(
                            "lt-LT"
                          )}
                        </span>
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                        Laukiama
                      </span>
                      <div className="flex items-center bg-blue-100 text-db px-2 py-0.5 rounded-full">
                        <Clock size={14} className="mr-1" />
                        <span className="text-sm font-medium">
                          {new Date(request.endDate).getDate() -
                            new Date(request.startDate).getDate() +
                            1}{" "}
                          d.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        request.id,
                        "APPROVED",
                        request.userEmail
                      )
                    }
                    disabled={
                      loadingApprove === request.id || loadingReject !== null
                    } // Disable "Approve" button if already loading
                    className="px-4 py-2 bg-emerald-200 text-green-800 rounded-md text-sm shadow-sm hover:bg-emerald-300 transition-colors disabled:opacity-50"
                  >
                    {loadingApprove === request.id ? (
                      <div className="flex items-center">
                        <RefreshCcw className="w-3 h-3 mr-2 animate-spin" />
                        <span>Tvirtinama</span>
                      </div>
                    ) : (
                      "Patvirtinti"
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        request.id,
                        "REJECTED",
                        request.userEmail
                      )
                    }
                    disabled={
                      loadingReject === request.id || loadingApprove !== null
                    }
                    className="px-4 py-2 bg-rose-200 text-red-800 rounded-md text-sm shadow-sm hover:bg-rose-300 transition-colors disabled:opacity-50"
                  >
                    {loadingReject === request.id ? (
                      <div className="flex items-center">
                        <RefreshCcw className="w-3 h-3 mr-2 animate-spin" />
                        <span>Atmetama</span>
                      </div>
                    ) : (
                      "Atmesti"
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
