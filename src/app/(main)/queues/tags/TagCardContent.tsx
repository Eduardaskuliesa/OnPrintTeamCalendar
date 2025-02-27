import { TagType } from "@/app/types/orderApi";
import { Timer } from "lucide-react";

interface TagCardProps {
  tag: TagType;
  onStatusUpdate: (tagId: number, newStatus: boolean) => void;
  onDelete: (tag: any) => void;
  loadingTags: Record<string, boolean>;
}

const formatWaitDuration = (milliseconds: number) => {
  const minutes = milliseconds / (1000 * 60);
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return `${Math.floor(days)} ${days === 1 ? "diena" : "dienų"}`;
  }
  if (hours >= 1) {
    return `${Math.floor(hours)} ${hours === 1 ? "valanda" : "valandų"}`;
  }
  return `${Math.floor(minutes)} ${minutes === 1 ? "minutė" : "minučių"}`;
};

export const TagCardContent = ({ tag }: { tag: TagCardProps["tag"] }) => (
  <div className="p-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center text-gray-700 mt-4">
          <Timer className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {formatWaitDuration(tag.scheduledFor)} laukimas
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-right">
          <div className="text-xl font-semibold text-gray-900">
            {tag.jobsCount}
          </div>
          <div className="text-sm text-gray-600">paveiktos eilės</div>
        </div>
        <div className="flex justify-end mt-2">
          {tag.isActive ? (
            <span className="text-emerald-600 text-center">Aktyvus</span>
          ) : (
            <span className="text-red-600">Išjungtas</span>
          )}
        </div>
      </div>
    </div>
  </div>
);
