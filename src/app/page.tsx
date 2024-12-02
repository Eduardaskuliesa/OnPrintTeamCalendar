import React from "react";
import Calendar from "./components/Calendar";

import { getVacations } from "./lib/actions/vacation";

async function getInitialVacations() {
  return await getVacations();
}

const Home = async () => {
  const initialVacations = await getInitialVacations();
  return <Calendar initialVacations={initialVacations}></Calendar>;
};

export default Home;
