import Link from "next/link";
import { Suspense } from "react";

import EmailTemplateList from "./EmailTemplateList";
import EmailTemplatesListSkeleton from "./components/skeletons/EmailTemplatesListSkeleton";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";

const EmailTemplatesPage = async () => {
  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Link href="/email/new" className=" text-white rounded ">
          <Button>
            <SquarePlus /> Create New Template
          </Button>
        </Link>
      </div>

      <Suspense fallback={<EmailTemplatesListSkeleton />}>
        <EmailTemplateList />
      </Suspense>
    </div>
  );
};

export default EmailTemplatesPage;
