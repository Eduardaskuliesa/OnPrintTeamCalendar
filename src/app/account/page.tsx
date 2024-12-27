import { Suspense } from "react";
import UserInfo from "./UserInfo";
import PasswordForm from "./PasswordForm";
import UserStats from "./UserStats";
import { usersActions } from "../lib/actions/users";
import { UserSkeleton } from "./UserInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { User } from "../types/api";
import { getUserVacations } from "../lib/actions/users/getUsersVacations";
import { redirect } from "next/navigation";
import { totalmem } from "os";

export default async function UserPage() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return redirect("/login");

    const userData = await usersActions.getUser(session.user.userId);
    const vacationsData = await getUserVacations(session.user.userId);

    const currentYear = new Date().getFullYear();
    const now = new Date();

    // Process vacations
    const processedVacations = {
      // Filter and sort pending vacations by start date
      pendingVacations: vacationsData.data
        .filter((vacation) => vacation.status === "PENDING")
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        ),
      totalPendingVacationDays: vacationsData.data
        .filter((vacation) => vacation.status === "PENDING")
        .reduce((total, vacation) => total + vacation.totalVacationDays, 0),
      // Calculate total used vacation days from totalVacationDays of APPROVED vacations in the current year
      usedVacationDays: vacationsData.data
        .filter(
          (vacation) =>
            vacation.status === "APPROVED" &&
            new Date(vacation.startDate).getFullYear() === currentYear
        )
        .reduce((total, vacation) => total + vacation.totalVacationDays, 0),

      // Find the next upcoming vacation (including PENDING)
      nextVacation: vacationsData.data
        .filter(
          (vacation) =>
            (vacation.status === "APPROVED" || vacation.status === "PENDING") &&
            new Date(vacation.startDate) > now
        )
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )[0]?.startDate,
    };

    console.log(processedVacations.totalPendingVacationDays);

    const statsData = {
      totalVacationDays: userData.data.vacationDays || 20,
      usedVacationDays: processedVacations.usedVacationDays,
      totalPendingVacationDays: processedVacations.totalPendingVacationDays,
      pendingRequests: processedVacations.pendingVacations.length,
      nextVacation: processedVacations.nextVacation
        ? new Date(processedVacations.nextVacation).toISOString().split("T")[0]
        : null,
    };

    return (
      <div className="min-h-screen">
        <div className="py-4 max-w-6xl ml-[10%]">
          <Suspense fallback={<UserSkeleton />}>
            <UserInfo userData={userData.data as User} />
          </Suspense>
          <UserStats {...statsData} />
          <PasswordForm />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in UserPage:", error);
    return null;
  }
}
