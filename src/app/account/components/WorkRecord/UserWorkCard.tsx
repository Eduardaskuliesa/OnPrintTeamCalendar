"use client";
import React, { useState } from "react";
import {
  Clock,
  AlertTriangle,
  Timer,
  Loader2,
  X,
  FolderDown,
} from "lucide-react";

import { useGetAllUserMonthlyWorkRecordsNotFiltered } from "@/app/lib/actions/workrecords/hooks";
import StatCard from "../StatCard";
import {
  calculateTotalHours,
  calculateOvertimeBalance,
} from "@/app/utils/workRecordsCalculation";
import { WorkRecord } from "@/app/types/api";
import { deleteWorkRecord } from "@/app/lib/actions/workrecords/deleteWorkRecord";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { toast } from "react-toastify";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import UserWorkRecordFilter from "./UserWorkRecordsFilter";
import WorkRecordsTable from "./WorkRecordsTable";
import WorkRecordUpdateForm from "./UpdateWorkRecordForm";

interface UserWorkRecordCardProps {
  userId: string;
}

const months = [
  "Sausis",
  "Vasaris",
  "Kovas",
  "Balandis",
  "Gegužė",
  "Birželis",
  "Liepa",
  "Rugpjūtis",
  "Rugsėjis",
  "Spalis",
  "Lapkritis",
  "Gruodis",
];

const UserWorkRecordCard: React.FC<UserWorkRecordCardProps> = ({ userId }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string | null>("all");
  const [selectedDay, setSelectedDay] = useState<string | null>("all");
  const [searchDate, setSearchDate] = useState(
    new Date().getFullYear().toString()
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<WorkRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const { data, isLoading } = useGetAllUserMonthlyWorkRecordsNotFiltered(
    userId,
    searchDate
  );
  const currentYear = new Date().getFullYear();
  const queryClient = useQueryClient();

  const handleSearch = () => {
    let newSearchDate = `${selectedYear}`;

    if (selectedMonth && selectedMonth !== "all") {
      const monthIndex = months.indexOf(selectedMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      newSearchDate += `-${formattedMonth}`;

      if (selectedDay && selectedDay !== "all") {
        newSearchDate += `-${selectedDay}`;
      }
    }

    setSearchDate(newSearchDate);
  };
  const handleReset = () => {
    setSelectedYear(currentYear);
    setSelectedMonth("all");
    setSelectedDay("all");
    setSearchDate(currentYear.toString());
    console.log(selectedMonth);
  };

  const handleDeleteClick = (record: WorkRecord) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (record: WorkRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;

    setIsDeleting(true);
    try {
      const result = await deleteWorkRecord(
        selectedRecord.userId,
        selectedRecord.date
      );

      console.log(searchDate);

      await queryClient.invalidateQueries({
        queryKey: ["userWorkRecords", userId, searchDate],
      });

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Įrašas sėkmingai ištrintas");
      }
    } catch (error: any) {
      console.error("Error deleting record:", error);
      toast.error(
        error.message || "Įvyko nenumatyta klaida. Bandykite dar kartą."
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
    }
  };

  const overtimeHours = calculateTotalHours(data?.data, ["overtime"]);
  const absentHours = calculateTotalHours(data?.data, ["early_leave", "late"]);
  const overtimeBalance = calculateOvertimeBalance(overtimeHours, absentHours);

  return (
    <>
      <div className="bg-[#EADBC8] mb-6 w-full max-w-4xl p-6 rounded-2xl shadow-md">
        <div className="flex flex-row items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Šio mėnesio valandos
          </h2>
          <UserWorkRecordFilter
            currentYear={currentYear}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            months={months}
            onYearChange={setSelectedYear}
            onMonthChange={(value) => {
              setSelectedMonth(value);
              setSelectedDay("all");
            }}
            onDayChange={setSelectedDay}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-32 bg-white bg-opacity-80 rounded-xl animate-pulse"></div>
              <div className="h-32 bg-white bg-opacity-80 rounded-xl animate-pulse"></div>
              <div className="h-32 bg-white bg-opacity-80 rounded-xl animate-pulse"></div>
            </div>
            <div className="flex w-full justify-center items-center">
              <Loader2 size={44} className="animate-spin text-db " />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                icon={Clock}
                iconColor="text-green-800"
                textColor="text-green-800"
                iconBg="bg-green-100"
                value={`${overtimeHours || "00:00"}h`}
                title="Viršvalandžiai"
              />
              <StatCard
                icon={AlertTriangle}
                iconColor="text-red-800"
                textColor="text-red-800"
                iconBg="bg-red-100"
                value={`${absentHours || "00:00"}h`}
                title="Vėlavimai / Anksti išėjimai"
              />
              <StatCard
                icon={Timer}
                iconColor={
                  overtimeBalance.isPositive ? "text-green-600" : "text-red-600"
                }
                textColor={
                  overtimeBalance.isPositive ? "text-green-600" : "text-red-600"
                }
                iconBg={
                  overtimeBalance.isPositive ? "bg-green-100" : "bg-red-100"
                }
                value={`${overtimeBalance.value}h`}
                title={
                  overtimeBalance.isPositive
                    ? "Sukauptas laikas"
                    : "Skolingas laikas"
                }
              />
            </div>

            <div className="flex justify-start mb-4">
              <Button
                onClick={() => setShowTable(!showTable)}
                variant="ghost"
                className="bg-[#fefaf6] text-db flex items-center gap-2"
              >
                {showTable ? (
                  <>
                    <X className="h-4 w-4" />
                    Slėpti įrašus
                  </>
                ) : (
                  <>
                    <FolderDown className="h-4 w-4" />
                    Peržiūrėti įrašus
                  </>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {showTable && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <WorkRecordsTable
                    handleEditClick={handleEditClick}
                    workRecordsData={data?.data as WorkRecord[]}
                    handleDeleteClick={handleDeleteClick}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <WorkRecordUpdateForm
        userId={userId}
        onCancel={handleCloseModal}
        isOpen={isModalOpen}
        record={selectedRecord}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRecord(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        reverseButtons
        message={
          selectedRecord ? (
            <span>
              Ar tikrai norite ištrinti įrašą data:{" "}
              <strong>
                {selectedRecord.date.slice(0, 10)} {selectedRecord.time}h
              </strong>
              ?
            </span>
          ) : (
            "Ar tikrai norite ištrinti šį įrašą?"
          )
        }
      />
    </>
  );
};

export default UserWorkRecordCard;
