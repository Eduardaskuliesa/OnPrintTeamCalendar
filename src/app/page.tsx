import React from "react";
import Calendar from "./components/Calendar";
import { getVacations } from "./lib/actions/vacation";

const Home = async () => {
  const initialVacations = await getVacations();

  return <Calendar initialVacations={initialVacations}></Calendar>;
};

export default Home;
