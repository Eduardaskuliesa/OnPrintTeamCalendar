import { Main } from "../components/Main";
import { SideBar } from "../components/SideBar/Sidebar";
import { ImpersonationBanner } from "../components/ImpersonationBanner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ImpersonationBanner />
      <SideBar />
      <Main>{children}</Main>
    </>
  );
}
