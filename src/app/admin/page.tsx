import { usersActions } from "../lib/actions/users";
import { User } from "../types/api";
import AdminPage, { Vacation } from "./AdminPage";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { getAdminVacations } from "../lib/actions/vacation";

export default async function AdminPageWrapper() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  try {
    const { data: users } = await usersActions.getUsers();
    const initialVacations = (await getAdminVacations()) as Vacation[];

    return (
      <AdminPage
        initialUsers={users as User[]}
        initialVacations={initialVacations}
      />
    );
  } catch (error) {
    console.error("Error in admin page:", error);
  }
}
