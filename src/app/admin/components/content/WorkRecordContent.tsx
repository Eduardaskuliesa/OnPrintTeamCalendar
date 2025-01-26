import React, { useState } from "react";
import { User } from "@/app/types/api";
import { Button } from "@/components/ui/button";
import { useMonthlyWorkRecords, useUserWorkRecords } from "@/app/lib/actions/workrecords/hooks";
import ReasonCell from "../../ReasonCell";
import { SettingHeader } from "../../SettingsHeader";
import WorkRecordSkeleton from "../skeletons/WorkRecordSkeleton";

interface WorkRecordContentProps {
  users: User[];
  selectedUser?: User | null;
}

const WorkRecordContent = ({
  users: initialUsers,
  selectedUser,
}: WorkRecordContentProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    selectedUser?.userId || "all"
  );

  const currentYearMonth = new Date().toISOString().slice(0, 10);
  console.log(currentYearMonth);
  const allRecordsQuery = useMonthlyWorkRecords(currentYearMonth);
  const userRecordsQuery = useUserWorkRecords(selectedUserId, currentYearMonth);

  const {
    data: records,
    isLoading,
    currentPage,
    hasMore,
    handleNextPage,
    handlePreviousPage,
  } = selectedUserId === "all" ? allRecordsQuery : userRecordsQuery;

  const handleUserChange = (value: string) => {
    setSelectedUserId(value);
  };

  console.log(allRecordsQuery.data?.length);

  return (
    <div className="space-y-6">
      <SettingHeader
        users={initialUsers}
        selectedUserId={selectedUserId}
        onUserChange={handleUserChange}
        title="Darbo laiko apskaita"
        defaultOption={{
          id: "all",
          label: "Visų darbuotojų apžvalga",
          badgeText: "Visų darbuotojų apžvalga",
        }}
        selectPlaceholder="Pasirinkite darbuotoją"
        usersLabel="Darbuotojai"
      />
      {isLoading ? (
        <WorkRecordSkeleton />
      ) : (
        <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
          {!records || records.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nėra įrašų šiam darbuotojui
            </div>
          ) : (
            <>
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Darbuotojas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Tipas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Valandos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Priežastis
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record, index) => {
                    const user = initialUsers.find(
                      (u) => u.userId === record.userId
                    );
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 rounded-full flex items-center justify-center mr-2"
                              style={{ backgroundColor: user?.color }}
                            ></div>
                            <span className="text-sm font-medium text-gray-900">
                              {user?.name} {user?.surname}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.date.slice(0, 10)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium
                           ${
                             record.type === "overtime"
                               ? "bg-emerald-100 text-emerald-800"
                               : record.type === "late"
                               ? "bg-rose-100 text-rose-800"
                               : "bg-amber-100 text-amber-800"
                           }`}
                          >
                            {record.type === "overtime" && "Viršvalandžiai"}
                            {record.type === "late" && "Vėlavimas"}
                            {record.type === "early_leave" &&
                              "Ankstesnis išėjimas"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.time}
                        </td>
                        <td className="px-6 py-4 max-w-[14rem]">
                          <ReasonCell reason={record.reason} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-4 border-t">
                <div className="flex gap-2">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Ankstesnis
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Puslapis {currentPage}
                  </span>
                  <Button
                    onClick={handleNextPage}
                    disabled={!hasMore}
                    variant="outline"
                    size="sm"
                  >
                    Sekantis
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkRecordContent;
