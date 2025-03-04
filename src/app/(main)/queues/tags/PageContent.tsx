"use client";
import { useSearchParams } from "next/navigation";
import TagPage from "./TagPage/TagPage";
import RulePage from "./RulesPage/RulePage";

const PageContent = () => {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "tags";

  return <>{currentView === "tags" ? <TagPage /> : <RulePage />}</>;
};

export default PageContent;
