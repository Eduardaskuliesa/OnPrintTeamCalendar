import { Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface PageHeaderProps {
  searchQuery: string;
  isFetching: boolean;
  headerName: string;
  onSearchChange: (value: string) => void;
  children?: ReactNode;
}

export const PageHeader = ({
  searchQuery,
  isFetching,
  headerName,
  onSearchChange,
  children
}: PageHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-2xl font-bold mb-6 flex items-center">
      {headerName} {isFetching && <Loader className="ml-2 text-xl animate-spin" />}
    </h1>
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
      {children}
    </div>
  </div>
);
