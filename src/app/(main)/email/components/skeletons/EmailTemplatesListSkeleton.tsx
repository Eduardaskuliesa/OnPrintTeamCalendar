import { Skeleton } from "@/components/ui/skeleton";

export default function EmailTemplatesListSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <Skeleton className="w-1/3 h-6" />
            <div className="flex space-x-2">
              <Skeleton className="w-16 h-8" />
              <Skeleton className="w-16 h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
