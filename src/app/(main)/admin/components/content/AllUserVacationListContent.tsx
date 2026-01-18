import React, { useState } from "react";
import { SettingHeader } from "../../SettingsHeader";
import { User, Vacation } from "@/app/types/api";
import { useGetUserVacations } from "@/app/lib/actions/users/hooks/useGetUserVacations";
import { useUserVacationStats } from "@/app/lib/actions/users/hooks/useUserVacationStats";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import AdminVacationStats, {
  AdminVacationStatsSkeleton,
} from "./AdminVacationStats";
import { FaRegFilePdf } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WorkRecordSkeleton from "../skeletons/WorkRecordSkeleton";
import { useGetAdminVacations } from "@/app/lib/actions/users/hooks/useGetAdminVacations";
import { vacationsAction } from "@/app/lib/actions/vacations";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { useVacationPdf } from "@/app/hooks/useVacationPdf ";

interface AllUserVacationListContentProps {
  users: User[];
  selectedUser?: User | null;
  onUserUpdated?: (updatedUser: User) => void;
}

const ITEMS_PER_PAGE = 10;

const AllUserVacationListContent = ({
  users,
  selectedUser,
  onUserUpdated,
}: AllUserVacationListContentProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    selectedUser?.userId || "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<{
    id: string;
    userId: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const handleUserChange = (value: string) => {
    setSelectedUserId(value);
    setCurrentPage(1);
  };

  const userVacationQuery = useGetUserVacations(selectedUserId);
  const allVacationsQuery = useGetAdminVacations();
  const { stats, isLoading: statsLoading } = useUserVacationStats(
    selectedUserId !== "all" ? selectedUserId : ""
  );

  const { data: allRecords, isLoading } =
    selectedUserId === "all" ? allVacationsQuery : userVacationQuery;

  const sortedRecords = allRecords?.slice().sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    return dateA - dateB;
  });

  const totalRecords = sortedRecords?.length || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const records = sortedRecords?.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDeleteClick = (vacationId: string, userId: string) => {
    setSelectedVacation({ id: vacationId, userId });
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVacation) return;

    const currentUser = users.find(
      (user) => user.userId === selectedVacation.userId
    );

    setIsDeleting(true);
    try {
      const result = await vacationsAction.deleteVacation(
        selectedVacation.id,
        selectedVacation.userId
      );

      if (result.success) {
        toast.success("Atostogos sėkmingai ištrintos ir dienos buvo gražintos");

        if (
          currentUser &&
          onUserUpdated &&
          result.updatedUserBalance !== undefined
        ) {
          const updatedUser = {
            ...currentUser,
            vacationDays: result.updatedUserBalance,
          };
          onUserUpdated(updatedUser);
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["vacations"] }),
          queryClient.invalidateQueries({
            queryKey: ["vacations", selectedVacation.userId],
          }),
        ]);
        const updatedRecords = queryClient.getQueryData<Vacation[]>([
          "vacations",
        ]);
        const totalUpdatedRecords = updatedRecords?.length || 0;
        const newTotalPages = Math.ceil(totalUpdatedRecords / ITEMS_PER_PAGE);

        setCurrentPage((prevPage) =>
          prevPage > newTotalPages ? newTotalPages : prevPage
        );

        setIsModalOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Įvyko netikėta klaida");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setSelectedVacation(null);
    }
  };

  const { handlePdf, isGeneratingPdf } = useVacationPdf();

  return (
    <div className="space-y-6">
      <SettingHeader
        selectPlaceholder="Pasirinkite darbuotoją"
        defaultOption={{
          id: "all",
          label: "Visų atostogų apžvalga",
          badgeText: "Visų atostogų apžvalga",
        }}
        usersLabel="Darbotuojai"
        onUserChange={handleUserChange}
        title="Visos atostogos"
        users={users}
        selectedUserId={selectedUserId}
      />

      {selectedUserId !== "all" && (
        statsLoading ? (
          <AdminVacationStatsSkeleton />
        ) : stats ? (
          <AdminVacationStats stats={stats} />
        ) : null
      )}

      <div className="bg-slate-50 rounded-lg shadow-md border border-blue-50">
        {isLoading ? (
          <WorkRecordSkeleton />
        ) : !records || records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nėra atostogų įrašų
          </div>
        ) : (
          <>
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Darbuotojas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Nuo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Iki
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Atostoginės dienos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Statusas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Sukurta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Veiksmai
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((vacation) => (
                  <tr key={vacation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: vacation.userColor }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {vacation.userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vacation.startDate).toLocaleDateString("lt-LT")}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vacation.endDate).toLocaleDateString("lt-LT")}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                      {vacation.totalVacationDays}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vacation.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : vacation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vacation.status === "APPROVED"
                          ? "Patvirtinta"
                          : vacation.status === "PENDING"
                          ? "Laukiama"
                          : "Atmesta"}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vacation.createdAt).toLocaleDateString("lt-LT")}
                    </td>
                    <td className="px-6 py-3  whitespace-nowrap text-sm text-gray-500">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="p-2"
                          disabled={isGeneratingPdf(vacation.id)}
                        >
                          {isGeneratingPdf(vacation.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <MoreVertical size={18} />
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handlePdf(vacation as Vacation)}
                            disabled={isGeneratingPdf(vacation.id)}
                          >
                            <FaRegFilePdf className="mr-2 h-4 w-4" />
                            <span>Atsisiųsti PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClick(vacation.id, vacation.userId)
                            }
                            className="text-red-600 focus:text-red-800 focus:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Ištrinti</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t rounded-b-lg">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Ankstesnis
                </Button>
                <span className="text-sm text-gray-800">
                  Puslapis {currentPage} iš {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                >
                  Sekantis
                </Button>
              </div>
              <div className="text-sm text-gray-800">
                Viso: {totalRecords} įrašų
              </div>
            </div>
          </>
        )}
      </div>
      <DeleteConfirmation
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVacation(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        message={
          <span>
            Ar tikrai norite ištrinti atostogas darbuotojui{" "}
            <strong>
              {selectedVacation
                ? records?.find((v) => v.id === selectedVacation.id)?.userName
                : ""}
            </strong>
            ?
          </span>
        }
      />
    </div>
  );
};

export default AllUserVacationListContent;
