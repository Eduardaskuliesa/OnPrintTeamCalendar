import { getUsers } from "../lib/actions/users";
import { User } from "../types/api";
import AdminPage from "./AdminPage";
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";




export default async function AdminPageWrapper() {

  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect('/login');
  }

  try {
    const { data: users } = await getUsers();

    return <AdminPage initialUsers={users as User[]} />;

  } catch (error) {
    console.error("Error in admin page:", error);

    redirect('/error');

  }
}
