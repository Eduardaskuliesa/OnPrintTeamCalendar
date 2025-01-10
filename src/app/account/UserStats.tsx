import {
  Wallet, 
  CalendarRange, 
  Calculator, 
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";
import { Vacation } from "../types/api";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string | React.ReactNode;
  icon: any;
  iconBg: string;
  iconColor: string;
  textColor: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  textColor,
}: StatCardProps) => (
  <div className={"bg-[#fefaf6] p-6 rounded-2xl shadow-md"}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-db">{title}</h3>
      <div className={`${iconBg} p-2 rounded-lg`}>
        <Icon className={iconColor} size={20} />
      </div>
    </div>
    <div className="flex items-baseline space-x-2">
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
    {subtitle && (
      <div className="text-sm font-medium text-db mt-1">{subtitle}</div>
    )}
  </div>
);

export default function UserStats({
  realCurrentBalance,
  totalFutureVacationDays,
  currentVacationDays,
  futureVacationsList,
  userData,
}: any) {
  function formatNumber(value: number) {
    const withThreeDecimals = Number(value).toFixed(3);
    const formatted = withThreeDecimals.replace(/\.?0+$/, "");
    return formatted;
  }

  const approvedFutureVacations = futureVacationsList.filter(
    (vacation: Vacation) => vacation.status === "APPROVED"
  );

  const pendingVacations = futureVacationsList.filter(
    (vacation: Vacation) => vacation.status === "PENDING"
  );

  return (
    <div className="px-6 py-6 mb-4 bg-[#EADBC8] border-blue-50 border-2 rounded-3xl">
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
      <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-2 items-start">
        {/* Approved Vacations Card */}
        <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-db">
              Sekančios atostogos
            </h3>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="text-purple-800" size={20} />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-purple-800">
              {approvedFutureVacations.length > 0
                ? `${new Date(
                    approvedFutureVacations[0].startDate
                  ).toLocaleDateString("lt-LT")}  `
                : "Nėra"}
            </p>
          </div>

          <div className="text-sm font-medium text-db mt-1">
            <div className="mt-4 max-h-[10rem] overflow-auto custom-scrollbar space-y-3">
              {approvedFutureVacations.slice(1).map((vacation: Vacation) => (
                <div
                  key={vacation.id}
                  className="bg-slate-50 border-2 rounded-md border-l-purple-800 border-l-4 p-2 shadow-sm border-blue-50 font-medium text-base text-db flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <span>
                      {new Date(vacation.startDate).toLocaleDateString("lt-LT")}{" "}
                      - {new Date(vacation.endDate).toLocaleDateString("lt-LT")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Vacations Card */}
        <div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-db">
              Laukia patvirtinimo
            </h3>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="text-orange-700" size={20} />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-orange-700">
              {pendingVacations.length}
            </p>
          </div>

          <div className="text-sm font-medium text-db mt-1">
            <div className="mt-4 max-h-[10rem] overflow-auto custom-scrollbar space-y-3">
              {pendingVacations.map((vacation: Vacation) => (
                <div
                  key={vacation.id}
                  className="bg-slate-50 border-2 rounded-md border-l-orange-700 border-l-4 p-2 shadow-sm border-blue-50 font-medium text-base text-db flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2">
                    <span>
                      {new Date(vacation.startDate).toLocaleDateString("lt-LT")}{" "}
                      - {new Date(vacation.endDate).toLocaleDateString("lt-LT")}
                    </span>
                  </div>
                  <Trash2 className="h-5 w-5 mr-2 text-red-700 hover:text-red-900 hover:cursor-pointer transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
