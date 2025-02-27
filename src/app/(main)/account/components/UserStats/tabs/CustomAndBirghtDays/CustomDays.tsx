import React, { useMemo } from "react";
import { Pizza } from "lucide-react";
import { CustomDay } from "./types";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";
import ListItem from "./components/ListItem";

interface CustomDayListCardProps {
  customDaySearch: string;
  setCustomDaySearch: (value: string) => void;
  customDaysLoading: boolean;
  filteredCustomDays: CustomDay[];
  onAddClick: () => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

const CustomDayCard: React.FC<CustomDayListCardProps> = ({
  customDaySearch,
  setCustomDaySearch,
  customDaysLoading,
  filteredCustomDays,
  onAddClick,
  onUpdate,
  onDelete,
  formatDate,
}) => {
  const sortedCustomDays = useMemo(() => {
    return [...filteredCustomDays].sort((a, b) => {
      const [monthA, dayA] = a.fullDate.split("-").map(Number);
      const [monthB, dayB] = b.fullDate.split("-").map(Number);

      if (monthA !== monthB) {
        return monthA - monthB;
      }

      return dayA - dayB;
    });
  }, [filteredCustomDays]);
  return (
    <div className="bg-[#fefaf6] rounded-xl p-4">
      <Header
        title="Šventės"
        icon={<Pizza className="text-red-500 mb-1" size={20} />}
        onAddClick={onAddClick}
        addButtonText="Prideti šventę"
      />

      <SearchInput
        value={customDaySearch}
        onChange={setCustomDaySearch}
        placeholder="Ieškoti švenčių..."
      />

      <div className="space-y-2 overflow-y-auto max-h-[250px] custom-scrollbar">
        {customDaysLoading ? (
          <div className="text-center py-4 text-gray-500">Kraunama...</div>
        ) : sortedCustomDays?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Pagal įvestą paiešką švenčių nerasta
          </div>
        ) : (
          sortedCustomDays?.map((customDay) => (
            <ListItem
              key={customDay.customDayId}
              item={customDay}
              onUpdate={onUpdate}
              onDelete={onDelete}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CustomDayCard;
