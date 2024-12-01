"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";

const CalendarSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-10 bg-gray-200 rounded w-32" />
      <div className="h-10 bg-gray-200 rounded w-48" />
      <div className="h-10 bg-gray-200 rounded w-64" />
    </div>
    <div className="grid grid-cols-7 mb-1">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200" />
      ))}
    </div>
    <div className="grid grid-cols-7 gap-1">
      {[...Array(35)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

const sampleEvents = [
  {
    id: "1",
    title: "Meeting with Team",
    start: "2024-12-02T10:00:00",
    end: "2024-12-02T11:30:00",
    backgroundColor: "#4CAF50",
  },
  {
    id: "2",
    title: "Product Launch",
    start: "2024-12-05",
    end: "2024-12-07",
    backgroundColor: "#2196F3",
  },
  {
    id: "3",
    title: "Client Presentation",
    start: "2024-12-10T14:00:00",
    end: "2024-12-10T15:30:00",
    backgroundColor: "#9C27B0",
  },
];

const Calendar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState(sampleEvents);

  const handleEventClick = (clickInfo) => {
    if (
      confirm(`Are you sure you want to delete '${clickInfo.event.title}'?`)
    ) {
      clickInfo.event.remove();
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  const handleEventDrop = (eventDropInfo) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventDropInfo.event.id) {
        return {
          ...event,
          start: eventDropInfo.event.start,
          end: eventDropInfo.event.end,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  return (
    <div className="relative max-w-7xl bg-white p-4 rounded-lg shadow-lg h-[650px] overflow-auto custom-scrollbar">
      {isLoading && <CalendarSkeleton />}
      <div className={isLoading ? "invisible" : "visible"}>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            multiMonthPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          locale="lt"
          firstDay={1}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height="25vh"
          contentHeight="auto"
          dayMaxEvents={2}
          handleWindowResize={true}
          stickyHeaderDates={true}
          buttonText={{
            today: "Šiandien",
            month: "Mėnuo",
            week: "Savaitė",
            day: "Diena",
            year: "Metai",
          }}
          views={{
            timeGrid: {
              slotMinTime: "00:00:00",
              slotMaxTime: "24:00:00",
              slotDuration: "00:30:00",
            },
            multiMonthYear: {
              multiMonthMaxColumns: 3,
              multiMonthMinWidth: 250,
              multiMonthMinHeight: 200,
              eventDisplay: "block",
              displayEventEnd: true,
              displayEventTime: true,
              eventMinHeight: 25,
              multiMonthTitleFormat: { month: "long", year: "numeric" },
            },
          }}
          eventContent={(arg) => {
            return (
              <div
                className="text-xs   truncate rounded"
                style={{
                  backgroundColor: arg.event.backgroundColor,
                  color: "#fff",
                }}
              >
                {arg.timeText && (
                  <span className="font-medium mr-1">{arg.timeText}</span>
                )}
                <span className="text-center">{arg.event.title}</span>
              </div>
            );
          }}
          initialEvents={events}
          selectable={true}
          editable={true}
          droppable={true}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          select={(info) => {
            if (info.view.type === "multiMonthYear") {
              info.view.calendar.gotoDate(info.start);
              info.view.calendar.changeView("dayGridMonth");
            }
          }}
          loading={(loading) => setIsLoading(loading)}
        />
      </div>
    </div>
  );
};

export default Calendar;
