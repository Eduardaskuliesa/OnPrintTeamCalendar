import { Plus, Search } from "lucide-react";
import QueueTagButton from "./QueueTagButton";
import { Input } from "@/components/ui/input";

interface TagsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const TagsHeader = ({
  searchQuery,
  onSearchChange,
}: TagsHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold mb-6">Žingsniai</h1>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Ieškoti..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-48 bg-white"
        />
      </div>
      <QueueTagButton
        buttonClassName="flex group items-center gap-2 px-4 py-2 bg-dcoffe hover:bg-vdcoffe rounded-md transition-colors whitespace-nowrap"
        iconClassName="w-4 h-4 text-db group-hover:text-gray-50"
      >
        <span className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-db group-hover:text-gray-50" />
          <span className="text-sm text-db group-hover:text-gray-50">
            Pridėti tagą
          </span>
        </span>
      </QueueTagButton>
    </div>
  </div>
);
