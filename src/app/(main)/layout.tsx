import { Main } from "../components/Main";
import { SideBar } from "../components/SideBar/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SideBar />
      <Main>{children}</Main>
    </>
  );
}
