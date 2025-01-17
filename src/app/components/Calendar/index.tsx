"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import CalendarSkeleton from "./CalendarSkeleton";
import VacationForm from "./VacationForm";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import DeleteConfirmation from "@/app/ui/DeleteConfirmation";
import { Clock2, Plus, Shield } from "lucide-react";
import { User } from "@/app/types/api";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { vacationsAction } from "@/app/lib/actions/vacations";
import SettingsDisplay from "./SettingsDisplay";
import AdminVacationForm from "./AdminVacationForm";
import { useQueryClient } from "@tanstack/react-query";
import { Event } from "@/app/types/event";

interface CalendarToolbarProps {
  onAddVacation: () => void;
  onAddAdminVacation: () => void;
  isAdmin: boolean;
}
interface CalendarProps {
  initialVacations: Event[];
  user: User;
  isGlobalSettings: boolean;
  settings: GlobalSettingsType;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  onAddVacation,
  onAddAdminVacation,
  isAdmin,
}) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-semibold text-gray-800">Vacation Calendar</h1>
    <div className="flex gap-2">
      {isAdmin && (
        <button
          onClick={onAddAdminVacation}
          className="px-4 py-2 group bg-dcoffe text-gray-950 rounded-md hover:bg-vdcoffe hover:text-gray-100 transition-colors shadow-sm flex items-center gap-2"
        >
          <Shield
            size={18}
            className="transform transition-transform group-hover:scale-110"
          />
          Admin Booking
        </button>
      )}
      <button
        onClick={onAddVacation}
        className="px-4 py-2 group bg-dcoffe text-gray-950 rounded-md hover:bg-vdcoffe hover:text-gray-100 transition-colors shadow-sm flex items-center gap-2"
      >
        <Plus
          size={18}
          className="transform transition-transform group-hover:rotate-90"
        />
        Registruoti atostogas
      </button>
    </div>
  </div>
);

const Calendar = ({ initialVacations, settings }: CalendarProps) => {
  const { data: session } = useSession();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>(initialVacations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();
  const [selectedDates, setSelectedDates] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [loading, setLoading] = useState(false);

  const handleVacationCreated = (newEvents: Event[]) => {
    setEvents((prev) => [...prev, ...newEvents]);
  };

  const handleEventClick = (info: any) => {
    if (
      session?.user?.role !== "ADMIN" ||
      info.event.extendedProps.status === "GAP"
    )
      return;
    setSelectedEvent(info.event);
    setShowDeleteDialog(true);
  };

  const handleSelect = (selectInfo: any) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    try {
      const result = await vacationsAction.deleteVacation(
        selectedEvent.id,
        selectedEvent.extendedProps.userId,
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });

      if (result.success) {
        setEvents((prev) =>
          prev.filter(
            (event) => event.id !== result.id && event.id !== `gap-${result.id}`
          )
        );
        toast.success("Atostogos ištrintos");
      } else {
        console.log(result.message);
        toast.error(result.error || "Nepavyko ištrinti atostogų");
      }
    } catch (error) {
      toast.error("Įvyko klaida trinant atostogas");
      console.error("Delete vacation error:", error);
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setSelectedEvent(null);
    }
  };

  const isHoliday = (date: Date) => {
    const getLocalDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return settings.restrictedDays.holidays.includes(getLocalDateString(date));
  };
  return (
    <div className="max-w-[1300px]  py-4  ml-[5%]">
      <CalendarToolbar
        onAddVacation={() => {
          setSelectedDates({ start: null, end: null });
          setShowAddModal(true);
        }}
        onAddAdminVacation={() => {
          setSelectedDates({ start: null, end: null });
          setShowAdminModal(true);
        }}
        isAdmin={session?.user?.role === "ADMIN"}
      />
      <div className="bg-slate-50 border-2  border-blue-50 p-6 rounded-lg shadow-xl">
        {isLoading && <CalendarSkeleton />}
        <div className={isLoading ? "invisible" : "visible"}>
          <FullCalendar
            plugins={[dayGridPlugin, multiMonthPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="lt"
            expandRows={true}
            contentHeight="200px"
            handleWindowResize={true}
            dayMaxEvents={0}
            dayMaxEventRows={0}
            height="auto"
            moreLinkContent={null}
            firstDay={1}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "multiMonthYear,dayGridMonth",
            }}
            dayCellContent={(arg) => (
              <div
                className={`relative ${arg.view.type === "multiMonthYear"
                  ? "min-h-[auto]"
                  : "min-h-[48px]"
                  }`}
              >
                <div
                  className={`text justify-start ${arg.view.type === "multiMonthYear"
                    ? ` ${isHoliday(arg.date)
                      ? "font-bold text-sm text-red-600"
                      : "text-sm"
                    }`
                    : ""
                    }`}
                >
                  {arg.dayNumberText}
                </div>

                <SettingsDisplay
                  settings={settings}
                  date={arg.date}
                  viewType={arg.view.type}
                />
              </div>
            )}
            dayCellDidMount={(arg) => {
              if (settings.seasonalRules.enabled &&
                settings.seasonalRules.blackoutPeriods.some(period => {
                  const start = new Date(period.start);
                  const end = new Date(period.end);
                  start.setHours(0, 0, 0, 0);
                  end.setHours(23, 59, 59, 999);

                  const date = new Date(arg.date);
                  date.setHours(0, 0, 0, 0);

                  return date >= start && date <= end;
                })) {
                const dayFrame = arg.el.querySelector('.fc-daygrid-day-frame');
                if (dayFrame) {
                  dayFrame.classList.add('!bg-rose-100');
                }
              }
            }}
            stickyHeaderDates={true}
            select={handleSelect}
            selectable={true}
            selectMirror={true}
            buttonText={{
              today: "Šiandien",
              month: "Mėnuo",
              year: "Metai",
            }}
            views={{
              multiMonthYear: {
                multiMonthMaxColumns: 2,
                multiMonthMinWidth: 300,
                multiMonthMinHeight: 200,
                eventDisplay: "auto",
                height: "auto",
                stickyFooter: false,
                fixedWeekCount: false,
                dayMaxEvents: 4,
                dayCellMinHeight: 100,
                eventMinHeight: 15,
                eventShortHeight: 15,
                eventOverlap: false,
                displayEventTime: true,

                multiMonthTitleFormat: { month: "long", year: "numeric" },
              },
              dayGridMonth: {
                dayMaxEvents: true,
              },
            }}
            eventContent={(arg) => {
              const isPending = arg.event.extendedProps.status === "PENDING";

              if (arg.view.type === "multiMonthYear") {
                return (
                  <div
                    className="text-xs truncate rounded w-full"
                    style={{
                      backgroundColor: arg.event.backgroundColor,
                      color: "#fff",
                      fontSize: "0.65rem",

                      zIndex: 1,
                    }}
                  >
                    {arg.event.title}
                  </div>
                );
              }
              return (
                <div
                  className="w-full  px-2 truncate rounded flex items-center justify-between"
                  style={{
                    backgroundColor: arg.event.backgroundColor,
                    color: "#fff",
                    minHeight: "14px",
                    position: "relative",
                    left: "0",
                    right: "0",
                    zIndex: 1,
                    margin: "1px 0",
                    visibility: "visible",
                  }}
                >
                  <span className="text-[1rem] font-medium flex items-center">
                    {arg.event.title}
                    <span className="flex items-center animate-pulse">
                      {isPending && <Clock2 size={14} className="mx-1" />}
                    </span>
                  </span>
                </div>
              );
            }}
            eventDisplay="block"
            eventOverlap={false}
            displayEventEnd={true}
            events={events}
            eventClick={
              session?.user?.role === "ADMIN" ? handleEventClick : undefined
            }
            loading={(loading) => setIsLoading(loading)}
          />
        </div>
      </div>
      <DeleteConfirmation
        loading={loading}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        message={
          <>
            Ar tikrai norite ištrinti{" "}
            <strong>{selectedEvent?.extendedProps.email}</strong> atostogas?
          </>
        }
      />
      <VacationForm
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedDates({ start: null, end: null });
        }}
        initialStartDate={selectedDates.start}
        initialEndDate={selectedDates.end}
        onVacationCreated={handleVacationCreated}
      />

      <AdminVacationForm
        isOpen={showAdminModal}
        onClose={() => {
          setShowAdminModal(false);
          setSelectedDates({ start: null, end: null });
        }}
        initialStartDate={selectedDates.start}
        initialEndDate={selectedDates.end}
        onVacationCreated={handleVacationCreated}
      />
    </div>
  );
};

export default Calendar;
