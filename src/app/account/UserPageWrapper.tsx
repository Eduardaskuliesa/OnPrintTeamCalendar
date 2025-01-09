import { User } from "../types/api";
import { Suspense } from "react";
import { usersActions } from "../lib/actions/users";
import { getUserVacations } from "../lib/actions/users/getUsersVacations";
import PasswordForm from "./PasswordForm";
import UserInfo from "./UserInfo";
import UserStats from "./UserStats";
import { UserStatsSkeleton } from "./LoadingSkeletons";

export async function UserPageWrapper({ userId }: { userId: string }) {
  const [userData, vacationsData] = await Promise.all([
    usersActions.getUser(userId),
    getUserVacations(userId),
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
  };

  const yearlyUsagePercentage = userData.data.updateAmount * 365;
  const remainingVacationDays =
    yearlyUsagePercentage - processedVacations.usedVacationDays;
  function formatPercentage(value: number) {
    const withThreeDecimals = Number(value).toFixed(3);
    const formatted = withThreeDecimals.replace(/\.?0+$/, "");
    return formatted;
  }

  const statsData = {
    yearlyUsagePercentage: formatPercentage(remainingVacationDays),
    totalVacationDays: userData.data.vacationDays,
    usedVacationDays: processedVacations.usedVacationDays,
    pendingRequests: processedVacations.pendingVacations.length,
    totalPendingVacationDays: processedVacations.totalPendingVacationDays,
    nextVacation: processedVacations.nextVacation?.startDate
      ? new Date(processedVacations.nextVacation.startDate)
          .toISOString()
          .split("T")[0]
      : null,
  };

  return (
    <div className="py-4 max-w-6xl ml-[5%]">
      <UserInfo userData={userData.data as User} />

      <Suspense fallback={<UserStatsSkeleton />}>
        <UserStats {...statsData} />
      </Suspense>

      <PasswordForm />
    </div>
  );
}
