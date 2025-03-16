"use client";

import { useGetTemplate } from "@/app/lib/actions/templates/hooks/useGetTemplate";
import { Template } from "@/app/types/emailTemplates";
import { useSearchParams } from "next/navigation";
import React from "react";
import EmailUpdateBuilder from "./UpdateEmailBuilder";
import ComponentPanelSkeleton from "../components/skeletons/ComponentPanelSkeleton";
import { ArrowBigLeftDash, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const { data, isFetching } = useGetTemplate(Number(queryId));
  const template = data?.data as Template;

  return (
    <div>
      <div className="px-4">
        <Link href={"/email"}>
          <Button>
            <ArrowBigLeftDash/>
            Atgal
          </Button>
        </Link>
      </div>
      {isFetching ? (
        <div className="container p-2 gap-6">
          <div className="flex flex-row w-full gap-6">
            <div className="max-w-md w-full max-h-[350px]">
              <ComponentPanelSkeleton />
            </div>
            <div className="max-w-2xl w-full flex justify-center">
              <Loader className="animate-spin h-10 w-10 mt-24 "></Loader>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <EmailUpdateBuilder template={template} />
        </div>
      )}
    </div>
  );
};

export default Page;
