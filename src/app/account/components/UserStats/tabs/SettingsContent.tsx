import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import StatCard from '../StatCard';


const SettingsContent = () => {
  const stats = {
    meetings: {
      title: "Team Meetings",
      value: "12",
      icon: Users,
      subtitle: "This week",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-800",
      textColor: "text-purple-800"
    },
    events: {
      title: "Upcoming Events",
      value: "8",
      icon: CalendarIcon,
      subtitle: "Next 30 days",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-800",
      textColor: "text-blue-800"
    },
    hours: {
      title: "Hours Booked",
      value: "24.5",
      icon: Clock,
      subtitle: "This month",
      iconBg: "bg-green-100",
      iconColor: "text-green-800",
      textColor: "text-green-800"
    }
  };

  return (
    
      <><div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
      <StatCard {...stats.meetings} />
      <StatCard {...stats.events} />
      <StatCard {...stats.hours} />
    </div><div className="bg-[#fefaf6] p-6 rounded-2xl shadow-md">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg border-2 border-blue-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {new Date(2024, 0, i + 15).toLocaleDateString('lt-LT')}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {['Meeting', 'Event', 'Holiday'][i % 3]}
                </span>
              </div>
              <h4 className="font-semibold mb-1">
                {['Team Sync', 'Product Review', 'Company Event', 'Planning Session', 'Workshop', 'Training'][i]}
              </h4>
              <p className="text-sm text-gray-600">
                {['10:00 - 11:00', '14:00 - 15:30', '09:30 - 12:00'][i % 3]}
              </p>
            </div>
          ))}
        </div>
      </div></>
   
  );
};

export default SettingsContent;