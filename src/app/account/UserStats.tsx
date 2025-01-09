import {
  Wallet, // For current balance (like a wallet with money)
  CalendarRange, // For booked/reserved days
  Calculator, // For final balance calculation
  Calendar,
  Clock,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.FC<any>;
  iconBg: string;
  iconColor: string;
  textColor: string;
  width?: "normal" | "wide";
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  textColor,
  width = "normal",
}: StatCardProps) => (
  <div
    className={`bg-[#fefaf6] p-6 rounded-2xl shadow-md  ${
      width === "wide" ? "col-span-2" : ""
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-db">{title}</h3>
      <div className={`${iconBg} p-2 rounded-lg`}>
        <Icon className={iconColor} size={20} />
      </div>
    </div>
    <div className="flex items-baseline space-x-2">
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
    {subtitle && <p className="text-sm font-medium text-db mt-1">{subtitle}</p>}
  </div>
);

export default function UserStats({
  realCurrentBalance,
  totalFutureVacationDays,
  pendingRequests,
  nextVacation,
  currentVacationDays,
  userData,
}: any) {
  function formatNumber(value: number) {
    const withThreeDecimals = Number(value).toFixed(3);
    const formatted = withThreeDecimals.replace(/\.?0+$/, "");
    return formatted;
  }

  return (
    <div className="px-8 py-6 mb-4 bg-[#EADBC8] border-blue-50 border-2 rounded-3xl">
      <h2 className="text-2xl font-bold text-[#102C57] mb-2">
        Vacation Overview
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Likutis šiai dienai"
          value={formatNumber(realCurrentBalance)}
          icon={Wallet}
          subtitle={`+${userData.data.updateAmount.toFixed(3)} kasdien`}
          iconBg="bg-green-100"
          iconColor="text-green-800"
          textColor="text-green-800"
        />
        <StatCard
          title="Suplanuota dienų"
          value={formatNumber(totalFutureVacationDays)}
          icon={CalendarRange}
          subtitle="Būsimos atostogos"
          iconBg="bg-blue-100"
          iconColor="text-db"
          textColor="text-db"
        />
        <StatCard
          title="Galutinis likutis"
          value={formatNumber(currentVacationDays)}
          icon={Calculator}
          subtitle="Po visų atostogų"
          iconBg="bg-pink-100"
          iconColor="text-pink-700"
          textColor="text-pink-700"
        />
      </div>
      <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-2">
        <StatCard
          title="Kitos atostogos"
          value={
            nextVacation
              ? new Date(nextVacation).toLocaleDateString("lt-LT")
              : "Nėra"
          }
          subtitle="sekančios suplanuotos"
          icon={Calendar}
          iconBg="bg-purple-100"
          iconColor="text-purple-800"
          textColor="text-purple-800"
        />
        <StatCard
          title="Laukia tvirtinimo"
          value={pendingRequests}
          subtitle="prašymai nepatvirtinti"
          icon={Clock}
          iconBg="bg-orange-100"
          iconColor="text-orange-700"
          textColor="text-orange-700"
        />
      </div>
    </div>
  );
}
