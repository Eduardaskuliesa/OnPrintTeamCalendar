import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queueActions } from "@/app/lib/actions/queues";
import { BatchActionsButton } from "./BatchActionButton";
import { QueueTableHeader } from "./TableHeader";
import { PaginationComponent, PaginationProps } from "./Pagination";
import { QueueTableRow } from "./QueueTableRow";
import LoadingRowSkeleton from "./LoadingRowSkeleton";
import { QueueItem } from "@/app/types/queueApi";

interface QueueTableProps {
  items: QueueItem[];
  isLoading: boolean;
  pagination: PaginationProps;
  onPageChange: (page: number) => void;
}

const QueueTable: React.FC<QueueTableProps> = ({
  items,
  pagination,
  onPageChange,
  isLoading,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allJobIds = items.map((item) => item.jobId);
      setSelectedItems(allJobIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePauseItem = async (id: string) => {
    const response = await queueActions.pauseQueue(id);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] });
      queryClient.invalidateQueries({ queryKey: ["queue", "paused"] });
      toast.success("Eilė sustabdyta");
    }
    if (!response.success) {
      queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] });
      toast.error("Eilė nebe aktyvį");
    }
  };

  const handleResumeItem = async (id: string) => {
    const response = await queueActions.resumeQueue(id);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["queue", "delayed"] });
      queryClient.invalidateQueries({ queryKey: ["queue", "paused"] });
      toast.success("Eilė įjungta");
    }
  };

  const handleDeleteItem = async (id?: string) => {
    try {
      const itemsToDelete = id ? [id] : selectedItems;

      if (itemsToDelete.length === 0) {
        toast.error("No items selected for deletion");
        return;
      }

      if (itemsToDelete.length === 1) {
        const response = await queueActions.deleteQueue(itemsToDelete[0]);
        if (response.success) {
          queryClient.invalidateQueries({ queryKey: ["queue"] });
          toast.success("Eilė ištrinta");
          if (!id) {
            setSelectedItems([]);
          }
        } else {
          toast.error(response.error || "Nepavyko ištrinti eilės");
        }
        return;
      }

      const response = await queueActions.batchDeleteQueues(itemsToDelete);
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["queue"] });
        toast.success("Eilės ištrintos");
        setSelectedItems([]);
      } else {
        if (response.partialSuccess) {
          toast.warning(response.error || "Kai kurios eilės nebuvo ištrintos");
        } else {
          toast.error(response.error || "Nepavyko ištrinti eilių");
        }
      }
    } catch (error) {
      toast.error("Įvyko klaida trinant eiles");
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      <BatchActionsButton
        selectedItems={selectedItems}
        onDelete={() => handleDeleteItem()}
        items={items}
      />
      <div className="bg-white rounded-lg shadow flex flex-col">
        <Table className="h-full">
          <QueueTableHeader
            onSelectAll={handleSelectAll}
            allSelected={selectedItems.length === items.length}
          />
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <LoadingRowSkeleton key={`loading-${index}`} />
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-14 text-center text-gray-500"
                >
                  Nėra jokių įrašų
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <QueueTableRow
                  key={item.jobId}
                  item={item}
                  isSelected={selectedItems.includes(item.jobId)}
                  onSelect={handleSelectItem}
                  onPause={handlePauseItem}
                  onResume={handleResumeItem}
                  onDelete={handleDeleteItem}
                />
              ))
            )}
          </TableBody>
        </Table>
        <PaginationComponent
          pagination={pagination}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
};

export default QueueTable;
