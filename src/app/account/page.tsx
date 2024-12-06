import UserInfo from "./UserInfo";
import PasswordForm from "./PasswordForm";
import UserStats from "./UserStats";

export default async function UserPage() {
  const dummyStats = {
    totalVacationDays: 20,
    usedVacationDays: 12,
    pendingRequests: 2,
    nextVacation: "2024-12-20",
  };

  return (
    <div className="min-h-screen">
      <div className="py-4 max-w-6xl ml-[10%]">
        <UserInfo />
        <UserStats {...dummyStats} />
        <PasswordForm />
      </div>
    </div>
  );
}
