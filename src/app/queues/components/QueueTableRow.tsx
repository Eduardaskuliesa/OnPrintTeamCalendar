import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { ActionMenu } from "./ActionMenu";
import { QueueItem } from "@/app/types/queueApi";

interface QueueTableRowProps {
  item: QueueItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QueueTableRow: React.FC<QueueTableRowProps> = ({
  item,
  isSelected,
  onSelect,
  onPause,
  onResume,
  onDelete,
}) => {
  const calculateScheduledTime = (createdAt: string, scheduledFor: number) => {
    const createdDate = new Date(createdAt);
    const scheduledDate = new Date(createdDate.getTime() + scheduledFor);
    return scheduledDate.toLocaleString();
  };

  return (
    <TableRow key={item.jobId} className="border-b hover:bg-gray-50">
      <TableCell className="py-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(item.jobId)}
        />
      </TableCell>
      <TableCell className="py-2">
        {new Date(item.createdAt).toLocaleString()}
      </TableCell>
      <TableCell className="py-2">{item.email}</TableCell>
      <TableCell className="py-2">
        <Badge variant="secondary" className="font-medium">
          {item.tagName}
        </Badge>
      </TableCell>
      <TableCell className="py-2">
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell className="py-2">
        {item.status === "PAUSED"
          ? "sustabdytas"
          : calculateScheduledTime(item.updatedAt, item.scheduledFor)}
      </TableCell>
      <TableCell className="py-2">
        <ActionMenu
          status={item.status}
          onPause={() => onPause(item.jobId)}
          onResume={() => onResume(item.jobId)}
          onDelete={() => onDelete(item.jobId)}
        />
      </TableCell>
    </TableRow>
  );
};
