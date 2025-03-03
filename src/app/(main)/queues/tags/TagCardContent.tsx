import { TagType } from "@/app/types/orderApi";
import { Timer, Globe, Users, LayoutGrid } from "lucide-react";

export type tagType = "Global" | "Subscriber" | "All";

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

const getTagTypeIcon = (tagType: tagType) => {
  switch (tagType) {
    case "Global":
      return <Globe className="w-4 h-4 mr-1" />;
    case "Subscriber":
      return <Users className="w-4 h-4 mr-1" />;
    case "All":
      return <LayoutGrid className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

export const TagCardContent = ({ tag }: { tag: TagCardProps["tag"] }) => (
  <div className="p-4">
    <div className="flex flex-col justify-between h-full">

      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-700">
          <Timer className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {formatWaitDuration(tag.scheduledFor)} laukimas
          </span>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold text-gray-900">
            {tag.jobsCount}
          </div>
          <div className="text-sm text-gray-600">paveiktos eilės</div>
        </div>
      </div>


      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center text-gray-700">
          {getTagTypeIcon(tag.tagType as tagType)}
          <span className="text-sm">{tag.tagType}</span>
        </div>

        <div>
          {tag.isActive ? (
            <span className="text-emerald-600 text-center text-sm">Aktyvus</span>
          ) : (
            <span className="text-red-600 text-sm">Išjungtas</span>
          )}
        </div>
      </div>
    </div>
  </div>
);