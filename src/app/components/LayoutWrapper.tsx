'use client';
import { usePathname } from 'next/navigation';
import Sidebar from "./SideBar/Sidebar";
import { Main } from "./Main";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/login');

  if (isAuthPage) {
    return children;
  }

  return (
    <>
      <Sidebar />
      <Main>{children}</Main>
    </>
  );
}