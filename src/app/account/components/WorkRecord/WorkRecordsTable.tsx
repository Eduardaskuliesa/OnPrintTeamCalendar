import ReasonCell from "@/app/admin/ReasonCell";
import { WorkRecord } from "@/app/types/api";
import { Trash2 } from "lucide-react";
import React from "react";

interface WorkRecordTablePops {
  workRecordsData: WorkRecord[];
  handleDeleteClick: (record: WorkRecord) => void;
}
const WorkRecordsTable = ({
  workRecordsData,
  handleDeleteClick,
}: WorkRecordTablePops) => {
  return (
    <>
      {!workRecordsData || workRecordsData.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Nėra jokiu įrašų šiam filtrui
        </div>
      ) : (
        <div className="max-h-[500px] overflow-auto custom-scrollbar rounded-xl">
          <table className="min-w-full">
            <thead className="bg-[#fefaf6] border-b sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-db uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-db uppercase tracking-wider">
                  Tipas
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-db uppercase tracking-wider">
                  Valandos
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-db uppercase tracking-wider">
                  Priežastis
                </th>
                <th className="px-2 py-3 text-left text-sm font-bold text-db uppercase tracking-wider">
                  Veiksmai
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-50 divide-y divide-gray-200">
              {workRecordsData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
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
                      {record.type === "early_leave" && "Ankstesnis išėjimas"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 max-w-[14rem]">
                    <ReasonCell reason={record.reason} />
                  </td>
                  <td className="pr-10 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleDeleteClick(record)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default WorkRecordsTable;
