import { Calculator, CalendarRange, Wallet } from "lucide-react";
import { formatNumber } from "@/app/utils/formatters";
import { VacationStats } from "@/app/lib/utils/vacationStatsCalculator";

interface AdminVacationStatsProps {
  stats: VacationStats;
}

export const AdminVacationStatsSkeleton = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-slate-50 p-4 md:p-6 rounded-lg shadow-md border-2 border-blue-50"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-5 w-5 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mt-2"></div>
          <div className="h-3 w-24 bg-slate-200 rounded animate-pulse mt-2"></div>
        </div>
      ))}
    </div>
  );
};

const AdminVacationStats = ({ stats }: AdminVacationStatsProps) => {
  const todayDate = new Date().toLocaleDateString("lt-LT");

  const statCards = [
    {
      title: "Atostogų dienos",
      value: formatNumber(stats.realCurrentBalance),
      icon: Wallet,
      subtitle: todayDate,
      iconColor: "text-green-500",
    },
    {
      title: "Rezervuotos dienos",
      value: formatNumber(stats.totalFutureVacationDays),
      icon: CalendarRange,
      subtitle: "Būsimos atostogos",
      iconColor: "text-blue-500",
    },
    {
      title: "Likutis / Trūkumas",
      value: formatNumber(stats.currentVacationDays),
      icon: Calculator,
      subtitle: todayDate,
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-slate-50 p-4 md:p-6 rounded-lg shadow-md border-2 border-blue-50"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-gray-700 font-semibold text-sm md:text-base">
              {card.title}
            </h3>
            <card.icon className={card.iconColor} size={20} />
          </div>
          <p className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">
            {card.value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminVacationStats;
