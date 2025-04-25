"use client"
import { Template } from "@/app/types/emailTemplates";
import EmailTemplateItem from "./EmailTemplateItem";
import { useGetTemplates } from "@/app/lib/actions/templates/hooks/useGetTemplates";
import EmailTemplatesListSkeleton from "./components/skeletons/EmailTemplatesListSkeleton";

export default function EmailTemplateList() {
  const { data, isFetching, isError } = useGetTemplates();
  const templates = data?.data;

  if (isFetching) {
    return (
      <EmailTemplatesListSkeleton></EmailTemplatesListSkeleton>
    );
  }

  if (isError || !templates) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Nėra sukurta jokiu šablonų</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Nėra sukurta jokiu šablonų</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {templates.map((template: Template) => (
        <EmailTemplateItem key={template.id} template={template} />
      ))}
    </div>
  );
}
