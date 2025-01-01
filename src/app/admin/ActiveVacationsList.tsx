"use client";
import React from "react";
import { Clock } from "lucide-react";

interface Vacation {
  id: string;
  userName: string;
  startDate: string;
  userEmail: string;
  userColor: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ActiveVacationsListProps {
  vacations: Vacation[];
}

export default function ActiveVacationsList({
  vacations,
}: ActiveVacationsListProps) {
  return (
    <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
      <div className="p-2 sm:p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4 px-2 py-2 sm:px-0 sm:py-0">
          Atostogaujantys darbuotojai
        </h3>
        <div className="space-y-3">
          {vacations.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              Šiuo metu niekas neatostogauja
            </p>
          ) : (
            vacations.map((vacation) => {
              // Calculate days difference inside the map
              const daysDiff =
                Math.ceil(
                  (new Date(vacation.endDate).getTime() -
                    new Date(vacation.startDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1;

              return (
                <div
                  key={vacation.id}
                  className="flex items-center justify-between border-b border-slate-300 py-3 last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {vacation.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{vacation.userName}</p>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                          Atostogauja
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          Nuo{" "}
                          <span className="font-semibold">
                            {new Date(vacation.startDate).toLocaleDateString(
                              "lt-LT"
                            )}{" "}
                          </span>
                          iki{" "}
                          <span className="font-semibold">
                            {new Date(vacation.endDate).toLocaleDateString(
                              "lt-LT"
                            )}
                          </span>
                        </span>
                        <div className="hidden md:flex items-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          <Clock size={14} className="mr-1" />
                          <span className="text-sm font-medium">
                            {daysDiff} d.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
