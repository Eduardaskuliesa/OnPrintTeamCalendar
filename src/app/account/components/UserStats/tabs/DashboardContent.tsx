import { Vacation } from "@/app/types/api";
import {
  Calculator,
  Calendar,
  CalendarRange,
  Clock,
  Wallet,
} from "lucide-react";
import StatCard from "../StatCard";
import VacationList from "../VacationList";
import { formatNumber } from "@/app/utils/formatters";

interface DashboardContentProps {
  approvedVacations: Vacation[];
  pendingVacations: Vacation[];
  realCurrentBalance: number;
  totalFutureVacationDays: number;
  currentVacationDays: number;
}

const DashboardContent = ({
  approvedVacations,
  pendingVacations,
  realCurrentBalance,
  totalFutureVacationDays,
  currentVacationDays,
}: DashboardContentProps) => {
  const todayDate = new Date().toLocaleDateString("lt-LT");
  const stats = {
    balance: {
      title: <>Atostogų dienos</>,
      value: formatNumber(realCurrentBalance),
      icon: Wallet,
      subtitle: todayDate,
      iconBg: "bg-green-100",
      iconColor: "text-green-800",
      textColor: "text-green-800",
    },
    reserved: {
      title: "Rezervuotos dienos",
      value: formatNumber(totalFutureVacationDays),
      icon: CalendarRange,
      subtitle: "Būsimos atostogos",
      iconBg: "bg-blue-100",
      iconColor: "text-db",
      textColor: "text-db",
    },
    remaining: {
      title: <>Likutis / Trūkumas</>,
      value: formatNumber(currentVacationDays),
      icon: Calculator,
      subtitle: todayDate,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-700",
      textColor: "text-pink-700",
    },
  };

  return (
    <div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard {...stats.balance} />
        <StatCard {...stats.reserved} />
        <StatCard {...stats.remaining} />
      </div>
      <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-2 items-start">
        <VacationList
          vacations={approvedVacations}
          icon={Calendar}
          title="Sekančios atostogos"
          iconBg="bg-purple-100"
          iconColor="text-purple-800"
        />
        <VacationList
          vacations={pendingVacations}
          icon={Clock}
          title="Laukia patvirtinimo"
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
        />
      </div>
    </div>
  );
};

export default DashboardContent;
