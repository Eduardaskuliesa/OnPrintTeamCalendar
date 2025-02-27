import React, { Suspense } from "react";
import QueuePageWrapper from "./QueuePageWrapper";


const QueuePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Kraunama...</div>}>
        <QueuePageWrapper></QueuePageWrapper>
      </Suspense>
    </div>
  );
};

export default QueuePage;
