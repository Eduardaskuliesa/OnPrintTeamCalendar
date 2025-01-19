import { User } from "../types/api";
import { usersActions } from "../lib/actions/users";
import { getUserVacations } from "../lib/actions/users/getUsersVacations";
import PasswordForm from "./PasswordForm";
import UserInfo from "./UserInfo";
import UserStats from "./UserStats";
import UserWorkRecordCard from "./workRecord/UserWorkCard";

export async function UserPageWrapper({ userId }: { userId: string }) {
  const [userData, vacationsData, usersData] = await Promise.all([
    usersActions.getUser(userId),
    getUserVacations(userId),
    usersActions.getUsers(),
  ]);

  const currentYear = new Date().getFullYear();
  const now = new Date();

  const processedVacations = {
    pendingVacations: vacationsData.data
      .filter((vacation) => vacation.status === "PENDING")
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),

    totalPendingVacationDays: vacationsData.data
      .filter((vacation) => vacation.status === "PENDING")
      .reduce((total, vacation) => total + vacation.totalVacationDays, 0),

    usedVacationDays: vacationsData.data
      .filter(
        (vacation) =>
          vacation.status === "APPROVED" &&
          new Date(vacation.startDate).getFullYear() === currentYear
      )
      .reduce((total, vacation) => total + vacation.totalVacationDays, 0),

    futureVacations: vacationsData.data
      .filter(
        (vacation) =>
          (vacation.status === "APPROVED" || vacation.status === "PENDING") &&
          new Date(vacation.startDate) > now &&
          new Date(vacation.startDate).getFullYear() === currentYear
      )
      .reduce((total, vacation) => total + vacation.totalVacationDays, 0),

    nextVacation: vacationsData.data
      .filter(
        (vacation) =>
          (vacation.status === "APPROVED" || vacation.status === "PENDING") &&
          new Date(vacation.startDate) > now
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0],

    futureVacationsList: vacationsData.data
      .filter(
        (vacation) =>
          (vacation.status === "APPROVED" || vacation.status === "PENDING") &&
          new Date(vacation.startDate) > now
      )
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
  };

  const currentVacationDays = userData.data.vacationDays;

  const realCurrentBalance =
    userData.data.vacationDays + processedVacations.futureVacations;
  const totalFutureVacationDays = processedVacations.futureVacations;

  const yearlyUsagePercentage = userData.data.updateAmount * 365;
  const remainingVacationDays =
    yearlyUsagePercentage - processedVacations.usedVacationDays;

  function formatPercentage(value: number) {
    const withThreeDecimals = Number(value).toFixed(3);
    const formatted = withThreeDecimals.replace(/\.?0+$/, "");
    return formatted;
  }

  function formatDate(date: string | undefined | null) {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  }

  const statsData = {
    futureVacationsList: processedVacations.futureVacationsList,
    yearlyUsagePercentage: formatPercentage(remainingVacationDays),
    realCurrentBalance: realCurrentBalance,
    totalFutureVacationDays: totalFutureVacationDays,
    currentVacationDays: currentVacationDays,
    usedVacationDays: processedVacations.usedVacationDays,
    pendingRequests: processedVacations.pendingVacations.length,
    totalPendingVacationDays: processedVacations.totalPendingVacationDays,
    nextVacationEnd: formatDate(processedVacations.nextVacation?.endDate),
    nextVacation: formatDate(processedVacations.nextVacation?.startDate),
  };

  return (
    <div className="py-4 max-w-6xl ml-[5%]">
      <UserInfo userData={userData.data as User} />

      <UserStats
        {...statsData}
        userData={userData.data as User}
        usersData={usersData.data as User[]}
      />
      <UserWorkRecordCard userId={userId}></UserWorkRecordCard>
      <PasswordForm />
    </div>
  );
}
