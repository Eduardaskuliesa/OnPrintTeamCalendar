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
import { Plus } from "lucide-react";
import { User } from "@/app/types/api";
import { GlobalSettingsType } from "@/app/types/bookSettings";
import { vacationsAction } from "@/app/lib/actions/vacations";

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  status: string;
  gapDays?: number;
}

interface CalendarToolbarProps {
  onAddVacation: () => void;
}

interface CalendarProps {
  initialVacations: Event[];
  user: User;
  isGlobalSettings: boolean;
  settings: GlobalSettingsType;
  initialFetchTimestamp: string;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ onAddVacation }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-semibold text-gray-800">Vacation Calendar</h1>
    <button
      onClick={onAddVacation}
      className="px-4 py-2 group bg-dcoffe text-gray-950 rounded-md hover:bg-vdcoffe hover:text-gray-100 transition-colors shadow-sm flex items-center gap-2"
    >
      <Plus
        size={18}
        className="transform transition-transform group-hover:rotate-90"
      />
      Book Vacation
    </button>
  </div>
);

const Calendar = ({ initialVacations }: CalendarProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>(initialVacations);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEventClick = (info: any) => {
    if (
      session?.user?.role !== "ADMIN" ||
      info.event.extendedProps.status === "GAP"
    )
      return;
    setSelectedEvent(info.event);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    try {
      const result = await vacationsAction.deleteVacation(selectedEvent.id);
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

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <CalendarToolbar onAddVacation={() => setShowAddModal(true)} />
      <div className="bg-slate-50 border-2 border-blue-50 p-6 rounded-lg shadow-xl">
        {isLoading && <CalendarSkeleton />}
        <div className={isLoading ? "invisible" : "visible"}>
          <FullCalendar
            plugins={[dayGridPlugin, multiMonthPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="lt"
            firstDay={1}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "multiMonthYear,dayGridMonth",
            }}
            height="auto"
            contentHeight="auto"
            dayMaxEvents={2}
            handleWindowResize={true}
            stickyHeaderDates={true}
            dateClick={(info) => {
              if (info.view.type === "multiMonthYear") {
                info.view.calendar.changeView("dayGridMonth", info.date);
              }
            }}
            buttonText={{
              today: "Šiandien",
              month: "Mėnuo",
              year: "Metai",
            }}
            views={{
              multiMonthYear: {
                multiMonthMaxColumns: 3,
                multiMonthMinWidth: 250,
                multiMonthMinHeight: 200,
                eventDisplay: "auto",
                displayEventEnd: true,
                displayEventTime: true,
                eventMinHeight: 25,
                multiMonthTitleFormat: { month: "long", year: "numeric" },
                dayMaxEvents: true,
                moreLinkClick: "popover",
              },
              dayGridMonth: {
                dayMaxEvents: true,
                moreLinkClick: "popover",
              },
            }}
            eventContent={(arg) => {
              if (arg.view.type === "multiMonthYear") {
                return (
                  <div
                    className="text-xs truncate rounded w-full"
                    style={{
                      backgroundColor: arg.event.backgroundColor,
                      color: "#fff",
                      fontSize: "0.65rem",
                      lineHeight: 1,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {arg.event.title.split(" - ")[1] || arg.event.title}
                  </div>
                );
              }
              return (
                <div
                  className="w-full py-1 px-2 truncate rounded flex items-center"
                  style={{
                    backgroundColor: arg.event.backgroundColor,
                    color: "#fff",
                    minHeight: "24px",
                    position: "relative",
                    left: "0",
                    right: "0",
                    zIndex: 1,
                    margin: "1px 0",
                    visibility: "visible",
                  }}
                >
                  <span className="text-sm font-medium">{arg.event.title}</span>
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
            selectable={true}
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
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
};

export default Calendar;
