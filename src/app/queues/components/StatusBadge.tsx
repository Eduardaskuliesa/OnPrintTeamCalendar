import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusDisplayNames: Record<string, string> = {
    QUEUED: "Aktyvūs",
    ACTIVE: "Siunčiama",
    SENT: "Išsiųsti",
    FAILED: "Nepavykę",
    PAUSED: "Sustabdyti",
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "queued":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "paused":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusDisplay = (status: string): string => {
    return statusDisplayNames[status.toUpperCase()] || status;
  };

  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} font-medium`}
    >
      {getStatusDisplay(status)}
    </Badge>
  );
};
