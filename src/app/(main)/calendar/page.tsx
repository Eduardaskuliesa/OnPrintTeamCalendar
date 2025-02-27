import React, { Suspense } from "react";
import CalendarPageWrapper from "./CalendarWrapper";

const CalendarPage = () => {
  return (
    <Suspense fallback={<div>Kraunama...</div>}>
      <CalendarPageWrapper></CalendarPageWrapper>
    </Suspense>
  );
};

export default CalendarPage;
