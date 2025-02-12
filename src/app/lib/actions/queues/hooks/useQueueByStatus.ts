import { useQuery } from "@tanstack/react-query";
import { LastEvaluatedKey } from "@/app/types/queueApi";
import { getQueueItemsByStatus } from "../getQueueItemsByStatus";

export function useQueueByStatus(
  status: string,
  page: number,
  lastEvaluatedKey?: LastEvaluatedKey
) {
  console.log(status);
  return useQuery({
    queryKey: ["queue", status, page, lastEvaluatedKey?.jobId],
    queryFn: () => getQueueItemsByStatus(status, lastEvaluatedKey),
    enabled: !!status,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
