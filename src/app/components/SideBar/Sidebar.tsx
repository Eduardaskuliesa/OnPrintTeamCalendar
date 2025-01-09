/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Menu, X, User, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const NavItem = ({ href, icon, text, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-4 py-3
        ${
          isActive
            ? "bg-slate-50 text-[#102C57]"
            : "text-gray-700 hover:text-[#102C57]"
        }
        hover:bg-slate-100 transition-all duration-200`}
    >
      <div className={`${isActive ? "text-[#102C57]" : "text-gray-700"}`}>
        {icon}
      </div>
      <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">
        {text}
      </span>
    </Link>
  );
};

const Sidebar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    router.replace("/login");
    try {
      await signOut({ redirect: false });
      toast.success("Successfully logged out!");
    } catch (error: any) {
      console.log(error);
      toast.error("Error logging out");
    }
  };

  const { data: session } = useSession();

  const navItems = [
    ...(session?.user?.role === "ADMIN"
      ? [{ href: "/admin", icon: <User size={20} />, text: "Admin" }]
      : []),
    { href: "/calendar", icon: <Calendar size={20} />, text: "Calendar" },
    { href: "/account", icon: <Settings size={20} />, text: "Account" },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed top-0 z-[100] left-0 right-0 h-16 bg-[#EADBC8] border-b border-blue-100 shadow-sm md:hidden">
        <div className="flex items-center h-full px-4">
          <div className="font-bold text-[#102C57]">Calendar App</div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 ml-auto rounded-md hover:bg-slate-50 text-gray-700 hover:text-[#102C57] transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[49]  md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-full w-44 z-50 bg-[#EADBC8] border-r border-blue-100 shadow-sm
          transition-all duration-300
          md:left-0 
          ${isMobileMenuOpen ? "left-0" : "-left-full"}
          top-0
        `}
      >
        <div className="flex items-center p-4 border-b border-slate-100">
          <div className="font-bold text-[#102C57]">Calendar App</div>
          {/* Only show close button on mobile */}
          <button
            onClick={closeMobileMenu}
            className="p-2 ml-auto rounded-md hover:bg-slate-50 text-gray-700 hover:text-[#102C57] transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col mt-4">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              {...item}
              onClick={() => {
                if (window.innerWidth < 768) {
                  closeMobileMenu();
                }
              }}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-100">
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="flex items-center w-full px-4 py-3 text-rose-700 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Content Padding for Mobile */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Sidebar;
