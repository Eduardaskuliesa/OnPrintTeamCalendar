import { usersActions } from "@/app/lib/actions/users";
import { vacationsAction } from "@/app/lib/actions/vacations";
import { User, Vacation } from "@/app/types/api";
import AdminPage from "./AdminPage";

export default async function AdminPageWrapper() {
  try {
    const { data: users } = await usersActions.getUsers();
    const initialVacations = await vacationsAction.getAdminVacations();

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
