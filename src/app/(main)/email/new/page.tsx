import React from "react";
import NewEmailBuilder from "./NewEmailBuilder";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowBigLeftDash } from "lucide-react";

const NewEmailPage = () => {
  return (
    <div className="container">
      <div className="px-4">
        <Link href={"/email"}>
          <Button>
            <ArrowBigLeftDash />
            Atgal
          </Button>
        </Link>
      </div>
      <NewEmailBuilder />
    </div>
  );
};

export default NewEmailPage;
