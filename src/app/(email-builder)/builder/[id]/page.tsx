"use client"
import React from "react";

import { useSearchParams } from "next/navigation";
import { useGetTemplate } from "@/app/lib/actions/templates/hooks/useGetTemplate";
import { Template } from "@/app/types/emailTemplates";
import EmailBuilderHeader from "./components/EmailBuilderHeader";
import UpdateEmailBuilder from "./EmailBuilder";

const UpdateEmailBuilderPage = () => {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const { data } = useGetTemplate(Number(queryId));
  const template = data?.data as Template;
  return (
    <div>
      <EmailBuilderHeader template={template}></EmailBuilderHeader>
      <UpdateEmailBuilder template={template}></UpdateEmailBuilder>
    </div>
  );
};

export default UpdateEmailBuilderPage;
