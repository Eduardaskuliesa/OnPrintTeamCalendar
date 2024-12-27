import { usersActions } from "../lib/actions/users";
import { User, Vacation } from "../types/api";
import AdminPage from "./AdminPage";
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
    const initialVacations = await getAdminVacations();

    return (
      <AdminPage
        initialUsers={users as User[]}
        initialVacations={initialVacations as Vacation[]}
      />
    );
  } catch (error) {
    console.error("Error in admin page:", error);
  }
}
