import { getUsers } from "../lib/actions/users";
import { User } from "../types/api";
import AdminPage from "./AdminPage";

export default async function AdminPageWrapper() {
  const { data: users } = await getUsers();

  return <AdminPage initialUsers={users as User[]} />;
}
