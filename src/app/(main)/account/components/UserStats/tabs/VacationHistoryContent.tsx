"use client";
import { History, ArrowRight, Loader2 } from "lucide-react";
import { Vacation } from "@/app/types/api";
import { formatDate } from "@/app/utils/formatters";
import { FaRegFilePdf } from "react-icons/fa6";
import { useVacationPdf } from "@/app/hooks/useVacationPdf ";
import { useGetUserVacations } from "@/app/lib/actions/users/hooks/useGetUserVacations";

interface VacationHistoryContentProps {
  userId: string;
}

const VacationHistoryContent = ({ userId }: VacationHistoryContentProps) => {
  const { data: vacations, isLoading } = useGetUserVacations(userId);
  const { handlePdf, isGeneratingPdf } = useVacationPdf();

  const now = new Date();

  const pastVacations =
    vacations
      ?.filter(
        (vacation) =>
          vacation.status === "APPROVED" && new Date(vacation.endDate) < now
      )
      .sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-db">Atostogų istorija</h3>
          <div className="bg-gray-100 p-2 rounded-lg">
            <History className="text-gray-700" size={20} />
          </div>
        </div>

        {pastVacations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nėra praeities atostogų įrašų
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-auto custom-scrollbar">
            {pastVacations.map((vacation) => (
              <VacationHistoryItem
                key={vacation.id}
                vacation={vacation}
                onPdfClick={handlePdf}
                isGeneratingPdf={isGeneratingPdf}
              />
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Viso atostogų: <span className="font-semibold">{pastVacations.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

interface VacationHistoryItemProps {
  vacation: Vacation;
  onPdfClick: (vacation: Vacation) => void;
  isGeneratingPdf: (id: string) => boolean;
}

const VacationHistoryItem = ({
  vacation,
  onPdfClick,
  isGeneratingPdf,
}: VacationHistoryItemProps) => {
  return (
    <div className="bg-slate-50 border-2 rounded-md border-l-4 border-l-gray-400 p-3 shadow-sm border-blue-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 font-medium text-base text-db">
          <span>{formatDate(vacation.startDate)}</span>
          <ArrowRight className="w-4 h-4 text-gray-500" />
          <span>{formatDate(vacation.endDate)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {vacation.totalVacationDays} d.
          </span>
          <button
            onClick={() => onPdfClick(vacation)}
            title="Parsisiųsti PDF"
            disabled={isGeneratingPdf(vacation.id)}
            className="hover:opacity-70 transition-opacity"
          >
            {isGeneratingPdf(vacation.id) ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <FaRegFilePdf className="hover:cursor-pointer" size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VacationHistoryContent;
