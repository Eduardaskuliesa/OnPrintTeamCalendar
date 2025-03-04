import { Suspense } from "react";
import NavigationTabs, { NavigationTabsSkeleton } from "./NavigationTabs";
import PageContent from "./PageContent";
import { PageSkeleton } from "./PageSekelton";

const Page = () => {
  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <Suspense fallback={<NavigationTabsSkeleton />}>
          <NavigationTabs />
        </Suspense>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>
    </div>
  );
};

export default Page;
