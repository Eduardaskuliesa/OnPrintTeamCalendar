"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { addDays, differenceInDays, format } from 'date-fns';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const CustomCard = ({ title, value, className = "" }) => (
  <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
    <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

const VacationStats = ({ events }) => {
  const vacations = events.filter(event => event.type === 'vacation');
  const totalDays = vacations.reduce((acc, curr) => {
    return acc + differenceInDays(new Date(curr.end), new Date(curr.start));
  }, 0);
  
  const upcomingVacations = vacations.filter(event => new Date(event.start) > new Date());

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <CustomCard title="Total Vacations" value={vacations.length} />
      <CustomCard title="Total Days" value={totalDays} />
      <CustomCard title="Upcoming" value={upcomingVacations.length} />
    </div>
  );
};

const CalendarToolbar = ({ onAddVacation }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-semibold text-gray-800">Vacation Calendar</h1>
    <button
      onClick={onAddVacation}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
    >
      <span>+</span> Book Vacation
    </button>
  </div>
);

const VacationForm = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userName: "",
    startDate: "",
    endDate: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ userName: "", startDate: "", endDate: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Book Vacation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                required
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Book Vacation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Calendar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const checkVacationOverlap = (start, end) => {
    return events.some(event => {
      if (event.type !== 'vacation' && !event.classNames?.includes('vacation-gap')) {
        return false;
      }
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const newStart = new Date(start);
      const newEnd = new Date(end);
      
      return (newStart <= eventEnd && newEnd >= eventStart);
    });
  };

  const createVacationGap = (endDate) => {
    const gapStart = new Date(endDate);
    const gapEnd = addDays(gapStart, 5);
    return {
      id: `gap-${Date.now()}`,
      title: "Vacation Gap",
      start: gapStart,
      end: gapEnd,
      backgroundColor: "#808080",
      editable: false,
      classNames: ['vacation-gap']
    };
  };

  const handleVacationSubmit = (formData) => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start >= end) {
      toast.error("End date must be after start date");
      return;
    }

    if (checkVacationOverlap(start, end)) {
      toast.error("This time period overlaps with existing vacation!");
      return;
    }

    const duration = differenceInDays(end, start);
    const newEvent = {
      id: `vacation-${Date.now()}`,
      title: `Vacation - ${formData.userName}`,
      start: start,
      end: end,
      backgroundColor: "#FF9800",
      type: "vacation"
    };

    const newEvents = [newEvent];
    
    if (duration > 2) {
      const gapEvent = createVacationGap(end);
      newEvents.push(gapEvent);
    }

    setEvents(prevEvents => [...prevEvents, ...newEvents]);
    toast.success("Vacation booked successfully!");
    setShowAddModal(false);
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.event.classNames?.includes('vacation-gap')) {
      toast.info("This is a mandatory gap period between vacations");
      return;
    }

    if (
      confirm(`Are you sure you want to delete '${clickInfo.event.title}'?`)
    ) {
      const eventToDelete = clickInfo.event;
      const eventId = eventToDelete.id;
      
      if (eventToDelete.extendedProps.type === 'vacation') {
        const eventEnd = new Date(eventToDelete.end);
        
        setEvents(prevEvents => prevEvents.filter(event => {
          if (event.id === eventId) return false;
          
          if (event.classNames?.includes('vacation-gap') && 
              new Date(event.start).getTime() === eventEnd.getTime()) {
            return false;
          }
          
          return true;
        }));
        toast.success("Vacation and associated gap deleted successfully");
      } else {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        toast.success("Event deleted successfully");
      }
    }
  };

  const handleEventDrop = (eventDropInfo) => {
    if (checkVacationOverlap(
      eventDropInfo.event.start,
      eventDropInfo.event.end
    )) {
      toast.error("Cannot move vacation to a period that overlaps with existing vacation!");
      eventDropInfo.revert();
      return;
    }

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
    toast.success("Vacation dates updated successfully");
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <CalendarToolbar onAddVacation={() => setShowAddModal(true)} />
      <VacationStats events={events} />
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
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
            height="auto"
            contentHeight="auto"
            dayMaxEvents={2}
            handleWindowResize={true}
            stickyHeaderDates={true}
            dateClick={(info) => {
              if (info.view.type === "multiMonthYear") {
                info.view.calendar.changeView('dayGridMonth', info.date);
              }
            }}
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
                eventDisplay: "auto",
                displayEventEnd: true,
                displayEventTime: true,
                eventMinHeight: 25,
                multiMonthTitleFormat: { month: "long", year: "numeric" },
                dayMaxEvents: true,
                moreLinkClick: "popover"
              },
              dayGridMonth: {
                dayMaxEvents: true,
                moreLinkClick: "popover"
              }
            }}
            eventContent={(arg) => {
              if (arg.view.type === 'multiMonthYear') {
                return (
                  <div
                    className="text-xs truncate rounded"
                    style={{
                      backgroundColor: arg.event.backgroundColor,
                      color: "#fff",
                      padding: "1px 2px",
                      width: "100%",
                      fontSize: "0.65rem",
                      lineHeight: 1
                    }}
                  >
                    {arg.event.title.split(' - ')[0] === 'Vacation' ? 'V' : ''} {arg.event.title.split(' - ')[1] || arg.event.title}
                  </div>
                );
              }
              
              return (
                <div
                  className="text-xs truncate rounded p-1"
                  style={{
                    backgroundColor: arg.event.backgroundColor,
                    color: "#fff",
                  }}
                >
                  <span className="text-center">{arg.event.title}</span>
                </div>
              );
            }}
            events={events}
            editable={true}
            droppable={true}
            selectable={false}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            loading={(loading) => setIsLoading(loading)}
          />
        </div>
      </div>

      <VacationForm 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleVacationSubmit}
      />
      
      
    </div>
  );
};

export default Calendar;