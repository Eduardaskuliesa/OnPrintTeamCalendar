import { tempalteActions } from "@/app/lib/actions/templates";
import { Template } from "@/app/types/emailTemplates";
import Link from "next/link";
import EmailTemplateItem from "./EmailTemplateItem";

export default async function EmailTemplateList() {
  const templates = (await tempalteActions.getTemplates()).data;

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-gray-600 mb-4">No templates found</p>
        <Link
          href="/emails/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create Your First Template
        </Link>
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
