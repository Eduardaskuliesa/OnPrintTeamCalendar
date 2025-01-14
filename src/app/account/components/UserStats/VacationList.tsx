import { LucideIcon } from 'lucide-react';
import { Vacation } from '@/app/types/api';
import { formatDate } from '@/app/utils/formatters';


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
}: VacationListProps) => (
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
          ? `${formatDate(vacations[0].startDate)} - ${formatDate(vacations[0].endDate)}`
          : "Nėra"}
      </p>
    </div>
    <div className="mt-4 max-h-[10rem] overflow-auto custom-scrollbar space-y-3">
      {vacations.slice(1).map((vacation) => (
        <div
          key={vacation.id}
          className={`bg-slate-50 border-2 rounded-md border-l-4 p-2 shadow-sm border-blue-50 font-medium text-base text-db flex justify-between items-center ${
            vacation.status === "APPROVED" ? "border-l-purple-800" : "border-l-orange-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span>
              {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VacationList;