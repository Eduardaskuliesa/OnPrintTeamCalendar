import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { UserPageWrapper } from "./UserPageWrapper";

export default async function UserPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      <UserPageWrapper userId={session?.user.userId}></UserPageWrapper>
    </div>
  );
}
