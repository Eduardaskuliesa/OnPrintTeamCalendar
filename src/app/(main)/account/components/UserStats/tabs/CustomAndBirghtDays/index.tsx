import React, { useEffect, useState } from "react";
import {
  useGetAllCustomBirthDaysByUser,
  useGetAllCustomDays,
} from "@/app/lib/actions/customBirthDays/hooks";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { deleteBirthday } from "@/app/lib/actions/customBirthDays/deleteCustomBirthDay";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import AddBirthdayModal from "./modals/AddBirghtDayModal";
import UpdateBirthdayModal from "./modals/UpdateBirthdayModal";
import BirthdayListCard from "./Birthdays";
import { Birthday, CustomDay } from "./types";
import CustomDayCard from "./CustomDays";
import { deleteCustomDay } from "@/app/lib/actions/customBirthDays/deleteCustomDay";
import AddCustomDayModal from "./modals/AddCustomDayModal";
import UpdateCustomDayModal from "./modals/UpdateCustomDayModal";

type OpenModal =
  | "addBirthday"
  | "deleteBirthday"
  | "updateBirthday"
  | "addCustomDay"
  | "deleteCustomDay"
  | "updateCustomDay"
  | null;

interface Props {
  isDataReady: (ready: boolean) => void;
  userId: string;
}

const CustomAndBrightDays = ({ isDataReady, userId }: Props) => {
  const [birthdaySearch, setBirthdaySearch] = useState("");
  const [customDaySearch, setCustomDaySearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<Birthday | CustomDay | null>(
    null
  );
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const {
    data: birthdaysData,
    isLoading: birthdaysLoading,
    isFetched,
  } = useGetAllCustomBirthDaysByUser(userId || "");

  const {
    data: customDaysData,
    isLoading: customDaysLoading,
    isFetched: isCustomFetched,
  } = useGetAllCustomDays();

  useEffect(() => {
    isDataReady(isFetched && isCustomFetched);
  }, [isDataReady, isFetched, isCustomFetched]);

  const handleDelete = async (id: string, type: "birthday" | "customDay") => {
    const item =
      type === "birthday"
        ? birthdaysData?.data?.find((b) => b.birthdayId === id)
        : customDaysData?.data?.find((c) => c.customDayId === id);

    setSelectedItem((item as Birthday | CustomDay) || null);
    setOpenModal(type === "birthday" ? "deleteBirthday" : "deleteCustomDay");
  };

  const handleUpdate = (id: string, type: "birthday" | "customDay") => {
    const item =
      type === "birthday"
        ? birthdaysData?.data?.find((b) => b.birthdayId === id)
        : customDaysData?.data?.find((c) => c.customDayId === id);

    setSelectedItem((item as Birthday | CustomDay) || null);
    setOpenModal(type === "birthday" ? "updateBirthday" : "updateCustomDay");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    setIsDeleting(true);
    try {
      const result =
        "birthdayId" in selectedItem
          ? await deleteBirthday(selectedItem.birthdayId, userId)
          : await deleteCustomDay(selectedItem.customDayId);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);

      if ("birthdayId" in selectedItem) {
        await queryClient.invalidateQueries({
          queryKey: ["birthdays", userId],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["customDays"],
        });
      }

      setOpenModal(null);
      setSelectedItem(null);
    } catch (error) {
      toast.error(
        "birthdayId" in selectedItem
          ? "Įvyko klaida trinant gimtadienį, bandykite dar kartą"
          : "Įvyko klaida trinant šventę, bandykite dar kartą"
      );
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (fullDate: string) => {
    return fullDate
      ? new Date(fullDate).toLocaleDateString("lt-LT", {
          month: "long",
          day: "numeric",
        })
      : "";
  };

  const filterItems = (
    items: (Birthday | CustomDay)[] | undefined,
    searchTerm: string
  ) => {
    if (!searchTerm) return items || [];
    if (!items) return [];

    const searchTerms = searchTerm.toLowerCase().split(" ").filter(Boolean);

    return items.filter((item) => {
      const [monthNumber, dayNumber] = item.monthDay.split("-");
      const date = new Date(2000, parseInt(monthNumber) - 1, 1);
      let lithuanianMonth = date
        .toLocaleDateString("lt-LT", { month: "long" })
        .toLowerCase();

      if (lithuanianMonth.endsWith("io")) {
        lithuanianMonth = lithuanianMonth.slice(0, -2);
      }

      if (
        searchTerms.length === 2 &&
        searchTerms.every((term) => !isNaN(parseInt(term)))
      ) {
        const [searchMonth, searchDay] = searchTerms;
        return (
          monthNumber.padStart(2, "0") === searchMonth.padStart(2, "0") &&
          dayNumber.padStart(2, "0") === searchDay.padStart(2, "0")
        );
      }

      return searchTerms.every(
        (term) =>
          item.name.toLowerCase().includes(term) ||
          lithuanianMonth.includes(term) ||
          item.monthDay.includes(term)
      );
    });
  };

  const filteredBirthdays = filterItems(
    birthdaysData?.data as Birthday[],
    birthdaySearch
  );
  const filteredCustomDays = filterItems(
    customDaysData?.data as CustomDay[],
    customDaySearch
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <BirthdayListCard
        birthdaySearch={birthdaySearch}
        setBirthdaySearch={setBirthdaySearch}
        birthdaysLoading={birthdaysLoading}
        filteredBirthdays={filteredBirthdays as Birthday[]}
        onAddClick={() => setOpenModal("addBirthday")}
        onUpdate={(id) => handleUpdate(id, "birthday")}
        onDelete={(id) => handleDelete(id, "birthday")}
        formatDate={formatDate}
      />

      <CustomDayCard
        customDaySearch={customDaySearch}
        setCustomDaySearch={setCustomDaySearch}
        customDaysLoading={customDaysLoading}
        filteredCustomDays={filteredCustomDays as CustomDay[]}
        onAddClick={() => setOpenModal("addCustomDay")}
        onUpdate={(id) => handleUpdate(id, "customDay")}
        onDelete={(id) => handleDelete(id, "customDay")}
        formatDate={formatDate}
      />

      <AddBirthdayModal
        revalidateId={userId}
        isOpen={openModal === "addBirthday"}
        onClose={() => setOpenModal(null)}
      />

      <AddCustomDayModal
        isOpen={openModal === "addCustomDay"}
        onClose={() => setOpenModal(null)}
      />
      <UpdateCustomDayModal
        isOpen={openModal === "updateCustomDay"}
        onClose={() => {
          setOpenModal(null);
          setSelectedItem(null);
        }}
        initialData={
          selectedItem && "customDayId" in selectedItem
            ? {
                customDayId: selectedItem.customDayId,
                name: selectedItem.name,
                date: selectedItem.monthDay,
              }
            : undefined
        }
      />

      <UpdateBirthdayModal
        isOpen={openModal === "updateBirthday"}
        onClose={() => {
          setOpenModal(null);
          setSelectedItem(null);
        }}
        revalidateId={userId}
        initialData={
          selectedItem && "birthdayId" in selectedItem
            ? {
                birthdayId: selectedItem.birthdayId,
                name: selectedItem.name,
                date: selectedItem.fullDate,
              }
            : undefined
        }
      />

      <DeleteConfirmation
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        isOpen={!!openModal?.includes("delete")}
        onClose={() => {
          setOpenModal(null);
          setSelectedItem(null);
        }}
        message={
          openModal === "deleteBirthday"
            ? "Ar tikrai norite ištrinti šį gimtadienį? Šio veiksmo atšaukti negalėsite."
            : "Ar tikrai norite ištrinti šią šventę? Šio veiksmo atšaukti negalėsite."
        }
      />
    </div>
  );
};

export default CustomAndBrightDays;
