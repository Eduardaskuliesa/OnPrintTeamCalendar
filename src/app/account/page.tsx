import { Suspense } from "react";
import UserInfo from "./UserInfo";
import PasswordForm from "./PasswordForm";
import UserStats from "./UserStats";
import { usersActions } from "../lib/actions/users";
import { UserSkeleton } from "./UserInfo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { User } from "../types/api";

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const userData = await usersActions.getUser(session.user.userId);

  const dummyStats = {
    totalVacationDays: 20,
    usedVacationDays: 12,
    pendingRequests: 2,
    nextVacation: "2024-12-20",
  };

  return (
    <div className="min-h-screen">
      <div className="py-4 max-w-6xl ml-[10%]">
        <Suspense fallback={<UserSkeleton />}>
          <UserInfo userData={userData.data as User} />
        </Suspense>
        <UserStats {...dummyStats} />
        <PasswordForm />
      </div>
    </div>
  );
}
