"use client";
import { useSidebar } from "../context/SidebarContext";

export function Main({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  return (
    <main
      className={`transition-all duration-300  ${
        isCollapsed ? "ml-16" : "ml-44"
      } p-8`}
    >
      {children}
    </main>
  );
}
