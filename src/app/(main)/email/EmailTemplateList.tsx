import { tempalteActions } from "@/app/lib/actions/templates";
import { Template } from "@/app/types/emailTemplates";
import Link from "next/link";


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
    <div className="grid gap-4 bg-white ">
      {templates.map((template: Template) => (
        <div
          key={template.id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">{template.templateName}</h2>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/email/${template.templateName}?id=${template.id}`}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </Link>
              <button className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
