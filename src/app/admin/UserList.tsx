/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/app/types/api";
import { deleteUser } from "../lib/actions/users";
import { toast } from "react-toastify";
import { useState } from "react";
import { Pencil, Trash2, Loader } from "lucide-react";
import DeleteUserConfirmation, {
  ConfirmationMessage,
} from "../ui/DeleteUserConfirmation";

interface UserListProps {
  users: User[];
  onUserDeleted: (deletedEmail: string) => void;
  vacationRequests: any[];
}

export default function UserList({
  users,
  onUserDeleted,
  vacationRequests,
}: UserListProps) {
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      setDeletingEmail(userToDelete.email);
      setShowDeleteDialog(false);
      try {
        await deleteUser(userToDelete.email);
        toast.success("User deleted successfully");
        onUserDeleted(userToDelete.email);
      } catch (error: any) {
        toast.error(error.message || "Failed to delete user");
      } finally {
        setUserToDelete(null);
        setDeletingEmail(null);
      }
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setShowDeleteDialog(false);
  };

  const confirmationMessage: ConfirmationMessage = {
    title: "Patvirtinkite ištrynimą",
    message: (
      <span>
        Ar tikrai norite ištrinti{" "}
        {userToDelete?.name && (
          <span className="font-bold">{userToDelete.name}</span>
        )}
        ?
      </span>
    ),
  };

  return (
    <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Mano darbuotojai</h3>
        <div className="space-y-3">
          {users.map((user) => {
            const userVacations = vacationRequests.filter(
              (req) => req.userName === user.name
            );

            return (
              <div
                key={user.email}
                className="flex items-center justify-between border-b border-slate-300 py-3 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: user.color }}
                  >
                    <span className="text-white font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-950">{user.name}</p>
                    <p className="text-sm text-gray-800">{user.email}</p>
                    {userVacations.length > 0 && (
                      <p className="text-sm text-blue-600 mt-1">
                        Vacation:{" "}
                        {new Date(
                          userVacations[0].startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          userVacations[0].endDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-db bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                    title="Edit user"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    disabled={deletingEmail === user.email}
                    className="p-2 text-rose-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center"
                    title="Delete user"
                  >
                    {deletingEmail === user.email ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DeleteUserConfirmation
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        confirmationMessage={confirmationMessage}
      />
    </div>
  );
}
