import React from "react";
import { CakeIcon } from "lucide-react";
import { Birthday } from "./types";
import Header from "./components/Header";
import SearchInput from "./components/SearchInput";
import ListItem from "./components/ListItem";


interface BirthdayListCardProps {
  birthdaySearch: string;
  setBirthdaySearch: (value: string) => void;
  birthdaysLoading: boolean;
  filteredBirthdays: Birthday[];
  onAddClick: () => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

const BirthdayListCard: React.FC<BirthdayListCardProps> = ({
  birthdaySearch,
  setBirthdaySearch,
  birthdaysLoading,
  filteredBirthdays,
  onAddClick,
  onUpdate,
  onDelete,
  formatDate,
}) => {
  return (
    <div className="bg-[#fefaf6] rounded-xl p-4">
      <Header
        title="Gimtadieniai"
        icon={<CakeIcon className="text-yellow-700 mb-1" size={20} />}
        onAddClick={onAddClick}
        addButtonText="Prideti gimtadieni"
      />

      <SearchInput
        value={birthdaySearch}
        onChange={setBirthdaySearch}
        placeholder="Ieškoti gimtadienių..."
      />

      <div className="space-y-2 overflow-y-auto max-h-[250px] custom-scrollbar">
        {birthdaysLoading ? (
          <div className="text-center py-4 text-gray-500">Kraunama...</div>
        ) : filteredBirthdays?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Pagal įvestą paiešką gimtadienių nerasta
          </div>
        ) : (
          filteredBirthdays?.map((birthday) => (
            <ListItem
              key={birthday.birthdayId}
              item={birthday}
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

export default BirthdayListCard;
