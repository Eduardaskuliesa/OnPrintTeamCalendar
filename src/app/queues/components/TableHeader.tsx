import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  Calendar,
  Clock,
  Mail,
  Settings2,
  Tag,
} from "lucide-react";

interface TableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

export const QueueTableHeader: React.FC<TableHeaderProps> = ({
  onSelectAll,
  allSelected,
}) => {
  return (
    <TableHeader className="bg-lcoffe sticky top-0 z-10">
      <TableRow className="rounded-md">
        <TableHead className="w-12 py-3 px-4 rounded-tl-lg">
          <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
        </TableHead>
        <TableHead className="py-3 px-4 border-x">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Created At
          </div>
        </TableHead>
        <TableHead className="py-3 border-x px-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </div>
        </TableHead>
        <TableHead className="py-3 border-x px-4">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tag
          </div>
        </TableHead>
        <TableHead className="py-3 border-x px-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Status
          </div>
        </TableHead>
        <TableHead className="py-3 border-x px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled For
          </div>
        </TableHead>
        <TableHead className="w-12 py-3 px-4 rounded-tr-lg">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Actions
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
