import { redirect } from "next/navigation";

const Home = async () => {
  redirect("/calendar");

  return <div>Home Page</div>;
};

export default Home;
