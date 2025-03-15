import React from "react";
import NewEmailBuilder from "./NewEmailBuilder";

const NewEmailPage = () => {
  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-6">Create New Email Template</h1>
      <NewEmailBuilder />
    </div>
  );
};

export default NewEmailPage;
