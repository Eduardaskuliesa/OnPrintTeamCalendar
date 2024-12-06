import { Plus } from "lucide-react";

interface AddUserButtonProps {
  onClick: () => void;
}

export default function AddUserButton({ onClick }: AddUserButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex group items-center space-x-2 px-4 py-2 shadow-sm bg-lcoffe text-gray-950 rounded-md hover:bg-dcoffe transition-colors"
    >
      <Plus
        size={20}
        className="transform text-black transition-transform group-hover:rotate-90"
      />
      <span>Pridėti vartotoją</span>
    </button>
  );
}
