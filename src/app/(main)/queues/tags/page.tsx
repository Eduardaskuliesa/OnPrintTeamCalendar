"use client";
import { useSearchParams, useRouter } from "next/navigation";
import TagPage from "./TagPage/TagPage";
import RulePage from "./RulesPage/RulePage";



const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'tags';

  const navigateTo = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`/queues/tags?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex">
          <button
            onClick={() => navigateTo('tags')}
            className={`py-2 px-4 bg-slate-50 border-blue-50 border rounded-md font-medium ${currentView === 'tags'
              ? 'border-b-2 border-b-dcoffe text-db'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Tagai
          </button>
          <button
            onClick={() => navigateTo('rules')}
            className={`py-2 px-4 bg-slate-50 border-blue-50 rounded-md border font-medium ${currentView === 'rules'
              ? 'border-b-2 border-b-dcoffe text-db'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Taisyklės
          </button>
        </div>
      </div>
      {currentView === 'tags' ? (
        <>
          <TagPage></TagPage>
        </>
      ) : (
        <RulePage />
      )}
    </div>
  );
};

export default Page;