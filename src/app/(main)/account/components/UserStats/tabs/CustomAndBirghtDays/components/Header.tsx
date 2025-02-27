import { Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  icon: React.ReactNode;
  onAddClick: () => void;
  addButtonText: string;
}

const Header = ({ title, icon, onAddClick, addButtonText }: HeaderProps) => (
  <div className="flex justify-between items-center mb-8">
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-semibold text-db">{title}</h3>
      {icon}
    </div>
    <button
      onClick={onAddClick}
      className="bg-lcoffe hover:bg-dcoffe py-1 px-2 rounded-lg flex items-center"
    >
      {addButtonText}
      <Plus size={20} className="text-gray-600 ml-1" />
    </button>
  </div>
);

export default Header;
