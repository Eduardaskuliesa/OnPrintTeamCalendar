/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Menu, X, User, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/app/context/SidebarContext";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
}

const NavItem = ({ href, icon, text, isCollapsed }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center ${
        isCollapsed ? "justify-center" : "px-4"
      } py-3
        ${
          isActive
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }
        hover:bg-blue-50 transition-all duration-200`}
    >
      <div className={`${isActive ? "text-blue-600" : "text-gray-500"}`}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">
          {text}
        </span>
      )}
    </Link>
  );
};

const Sidebar = () => {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Successfully logged out!");

      router.push("/login");
    } catch (error: any) {
      console.log(error);
      toast.error("Error logging out");
    }
  };

  const navItems = [
    ...(session?.user?.role === "ADMIN"
      ? [{ href: "/admin", icon: <User size={20} />, text: "Admin" }]
      : []),
    { href: "/", icon: <Calendar size={20} />, text: "Calendar" },
    { href: "/account", icon: <Settings size={20} />, text: "Account" },
  ];

  return (
    <div
      className={`fixed h-full bg-white border-r shadow-sm
      ${isCollapsed ? "w-16" : "w-44"} transition-all duration-300`}
    >
      <div className="flex items-center p-4 border-b">
        <div
          className={`font-bold text-blue-600 ${
            isCollapsed ? "hidden" : "block"
          } whitespace-nowrap overflow-hidden transition-opacity duration-300
          ${isCollapsed ? "opacity-0" : "opacity-100"}`}
        >
          Calendar App
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 ml-auto rounded-md hover:bg-blue-50 text-gray-500
            hover:text-blue-600 transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="flex flex-col mt-4">
        {navItems.map((item, index) => (
          <NavItem key={index} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full ${
            isCollapsed ? "justify-center" : "px-4"
          }
            py-3 text-red-500 hover:bg-red-50 transition-colors`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
