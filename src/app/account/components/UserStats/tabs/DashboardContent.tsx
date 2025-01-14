import { Vacation } from "@/app/types/api";
import { Calendar, Clock } from "lucide-react";
import StatCard from "../StatCard";
import VacationList from "../VacationList";


interface DashboardContentProps {
  stats: {
    balance: any;
    reserved: any;
    remaining: any;
  };
  approvedVacations: Vacation[];
  pendingVacations: Vacation[];
}

const DashboardContent = ({ 
  stats, 
  approvedVacations, 
  pendingVacations,
}: DashboardContentProps) => (
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

export default DashboardContent