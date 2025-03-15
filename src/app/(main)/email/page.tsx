import Link from "next/link";
import { Suspense } from "react";

import EmailTemplateList from "./EmailTemplateList";
import EmailTemplatesListSkeleton from "./components/skeletons/EmailTemplatesListSkeleton";

const EmailTemplatesPage = async () => {
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Link
          href="/email/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create New Template
        </Link>
      </div>

      <Suspense fallback={<EmailTemplatesListSkeleton />}>
        <EmailTemplateList />
      </Suspense>
    </div>
  );
};

export default EmailTemplatesPage;
