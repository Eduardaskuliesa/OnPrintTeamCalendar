"use client"
import { ArrowRight, CircleX, LucideIcon } from 'lucide-react';
import { Vacation } from '@/app/types/api';
import { formatDate } from '@/app/utils/formatters';
import { useState } from 'react';
import VacationCancellationModal from './VacationCancellationModal';
import { toast } from 'react-toastify';
import { vacationsAction } from '@/app/lib/actions/vacations';

interface VacationListProps {
  vacations: Vacation[];
  icon: LucideIcon;
  title: string;
  iconBg: string;
  iconColor: string;
}

const VacationList = ({
  vacations,
  icon: Icon,
  title,
  iconBg,
  iconColor
}: VacationListProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<Vacation | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCircleClick = (vacation: Vacation) => {
    setSelectedVacation(vacation);
    setIsModalOpen(true);
  };
  

  const handleConfirmCancellation = async (vacation: Vacation) => {
    if (!vacation) return;

    setLoading(true);
    try {
      const result = await vacationsAction.cancelVacation(
        vacation.id,
        vacation.userId,
      );

      if (result.success) {
        toast.success("Atostogos sėkmingai atšauktos");
        setIsModalOpen(false);
        setSelectedVacation(null);
      } else {
        toast.error(result.error || "Nepavyko atšaukti atostogų");
      }
    } catch (error) {
      console.error('Error cancelling vacation:', error);
      toast.error("Sistemoje įvyko klaida");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-db">{title}</h3>
        <div className={`${iconBg} p-2 rounded-lg`}>
          <Icon className={iconColor} size={20} />
        </div>
      </div>
      <div className="flex items-baseline space-x-2">
        <p className={`text-3xl font-bold ${iconColor}`}>
          {vacations.length > 0
            ? vacations[0].status === "APPROVED"
              ? `${formatDate(vacations[0].startDate)} - ${formatDate(vacations[0].endDate)}`
              : vacations.length
            : "Nėra"}
        </p>
      </div>
      <div className="mt-4 max-h-[10rem] overflow-auto custom-scrollbar space-y-3">
        {vacations
          .filter(vacation => vacation.status === "APPROVED")
          .slice(1)
          .map((vacation) => (
            <div
              key={vacation.id}
              className={`bg-slate-50 border-2 rounded-md border-l-4 p-2 shadow-sm border-blue-50 font-medium text-base text-db flex justify-between items-center ${vacation.status === "APPROVED" ? "border-l-purple-800" : "border-l-orange-700"
                }`}
            >
              <div className="flex items-center space-x-2">
                <span>
                  {formatDate(vacation.startDate)}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <span>
                  {formatDate(vacation.endDate)}
                </span>
              </div>
            </div>
          ))}
        {vacations
          .filter(vacation => vacation.status === "PENDING")
          .map((vacation) => (
            <div
              key={vacation.id}
              className={`bg-slate-50 border-2 rounded-md border-l-4 p-2 shadow-sm border-blue-50 font-medium text-base text-db flex justify-between items-center ${vacation.status === "APPROVED" ? "border-l-purple-800" : "border-l-orange-700"
                }`}
            >
              <div className="flex items-center space-x-2">
                <span>
                  {formatDate(vacation.startDate)}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <span>
                  {formatDate(vacation.endDate)}
                </span>
              </div>
              <CircleX
                className="w-6 h-6 text-orange-700 hover:text-orange-800 hover:cursor-pointer transition-colors"
                onClick={() => handleCircleClick(vacation)}
              />
            </div>
          ))}
      </div>
      <VacationCancellationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVacation(null);
        }}
        onConfirm={() => selectedVacation && handleConfirmCancellation(selectedVacation)}
        loading={loading}
      />
    </div>

  );
};

export default VacationList;
