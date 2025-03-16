"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  Calendar,
  LogOut,
  Mail,
  ShieldCheck,
  ChevronDown,
  ShoppingCart,
  Tags,
  SquareLibrary,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface NavItemProps {
  href: string;
  icon: string;
  text: string;
  onClick?: () => void;
  subItems?: NavItemProps[];
}

interface ClientSidebarProps {
  navItems: NavItemProps[];
}

const iconMap = {
  User: <User size={20} />,
  Calendar: <Calendar size={20} />,
  Mail: <Mail size={20} />,
  ShieldCheck: <ShieldCheck size={20} />,
  ShoppingCart: <ShoppingCart size={16} />,
  Tags: <Tags size={16} />,
  SquareLibary: <SquareLibrary size={20} />,
};

const SubNavItem = ({
  href,
  icon,
  text,
  onClick,
}: Omit<NavItemProps, "subItems">) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between px-3 mx-0.5 py-2 rounded-lg
        ${isActive ? "bg-slate-50 text-[#102C57]" : "text-gray-700"}
        hover:bg-slate-50 hover:text-[#102C57] 
        transition-colors duration-200`}
    >
      <div className="flex items-center">
        {iconMap[icon as keyof typeof iconMap]}
        <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">
          {text}
        </span>
      </div>
    </Link>
  );
};

const NavItem = ({ href, icon, text, onClick, subItems }: NavItemProps) => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  const isParentActive = pathname.startsWith(href) && href !== "/";

  const isActive = pathname === href || isParentActive;

  const isChildActive =
    hasSubItems && subItems.some((item) => item.href === pathname);

  const iconComponent = iconMap[icon as keyof typeof iconMap];
  const activeIcon = React.cloneElement(iconComponent as React.ReactElement, {
    fill: isActive || isChildActive ? "#f8fafc" : "none",
  });

  const toggleDropdown = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    toggleDropdown(e);
    onClick?.();
  };

  return (
    <div>
      <Link
        href={href}
        onClick={handleClick}
        className={`flex items-center justify-between px-3 py-2 mx-1 rounded-md
          ${
            isActive
              ? "bg-slate-50 text-[#102C57]"
              : isChildActive
                ? " text-amber-900 "
                : "text-gray-700"
          }
          ${!isActive && "hover:bg-slate-50"} hover:text-[#102C57] 
          transition-colors duration-200`}
      >
        <div className="flex items-center">
          {activeIcon}
          <span className="ml-3 font-medium whitespace-nowrap overflow-hidden">
            {text}
          </span>
        </div>
        {hasSubItems && (
          <motion.div
            initial={false}
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        )}
      </Link>
      <AnimatePresence>
        {hasSubItems && isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-2 space-y-1 mt-1 overflow-hidden"
          >
            {subItems?.map((subItem, index) => (
              <SubNavItem key={index} {...subItem} onClick={onClick} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function ClientSidebar({ navItems }: ClientSidebarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const handleLogout = async () => {
    router.replace("/login");
    queryClient.clear();
    try {
      await signOut({ redirect: false });
      toast.success("Successfully logged out!");
    } catch (error: any) {
      console.log(error);
      toast.error("Error logging out");
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed top-0 z-[100] left-0 right-0 h-14 bg-[#EADBC8] border-b border-blue-100 shadow-sm md:hidden">
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-[49] md:hidden"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className="fixed h-full w-44 z-50 bg-[#EADBC8] border-r border-blue-100 shadow-sm md:left-0 top-0"
        animate={{ x: isDesktop ? 0 : isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center h-14 px-4 border-b border-slate-100">
          <div className="font-bold text-[#102C57]">Calendar App</div>
          <button
            onClick={closeMobileMenu}
            className="p-2 ml-auto rounded-md hover:bg-slate-50 text-gray-700 hover:text-[#102C57] transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 mt-2">
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
            className="flex items-center w-full px-4 py-2.5 text-rose-700 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Content Padding for Mobile */}
      <div className="md:hidden h-14" />
    </>
  );
}
