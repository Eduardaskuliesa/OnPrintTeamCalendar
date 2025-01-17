/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from "react";
import { Wallet, CalendarRange, Calculator } from "lucide-react";
import { Fredoka } from "next/font/google";

import { AnimatePresence, motion } from "framer-motion";
import { User, Vacation } from "../types/api";
import { formatNumber } from "../utils/formatters";

import NavigationTabs from "./components/UserStats/NavigationTabs";
import ActionContent from "./components/UserStats/tabs/ActionContent";
import DashboardContent from "./components/UserStats/tabs/DashboardContent";
import SettingsContent from "./components/UserStats/tabs/SettingsContent";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? "100%" : "-100%",
    opacity: 0.6,
  }),
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    y: direction < 0 ? "100%" : "-100%",
    opacity: 0.6,
  }),
};

const TABS = ["dashboard", "settings", "actions"];

interface UserStatsProps {
  realCurrentBalance: number;
  totalFutureVacationDays: number;
  currentVacationDays: number;
  futureVacationsList: Vacation[];
  userData: User;
  usersData: User[];
}

const UserStats = ({
  realCurrentBalance,
  totalFutureVacationDays,
  currentVacationDays,
  userData,
  usersData,
  futureVacationsList,
}: UserStatsProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [direction, setDirection] = useState(0);
  const [contentHeight, setContentHeight] = useState("auto");
  const contentRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);
  const [heightAnimationSpeed, setHeightAnimationSpeed] = useState(0.5);

  const paginate = (newTab: string) => {
    const currentIndex = TABS.indexOf(activeTab);
    const newIndex = TABS.indexOf(newTab);
    if (currentIndex === newIndex) {
      setActiveTab(newTab);
    } else {
      const isMovingToSmallerIndex = newIndex < currentIndex;
      setDirection(newIndex > currentIndex ? 1 : -1);
      setHeightAnimationSpeed(isMovingToSmallerIndex ? 0.3 : 0.4);
      setActiveTab(newTab);
      setKey((prevKey) => prevKey + 1);
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const newHeight = contentRef.current.offsetHeight;
        setContentHeight(`${newHeight}px`);
      }
    };

    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
    };
  }, [activeTab]);

  const todayDate = new Date().toLocaleDateString("lt-LT");

  const approvedFutureVacations = futureVacationsList.filter(
    (vacation) => vacation.status === "APPROVED"
  );

  const pendingVacations = futureVacationsList.filter(
    (vacation) => vacation.status === "PENDING"
  );

  const stats = {
    balance: {
      title: <>Atostogų dienos</>,
      value: formatNumber(realCurrentBalance),
      icon: Wallet,
      subtitle: todayDate,
      iconBg: "bg-green-100",
      iconColor: "text-green-800",
      textColor: "text-green-800",
    },
    reserved: {
      title: "Rezervuotos dienos",
      value: formatNumber(totalFutureVacationDays),
      icon: CalendarRange,
      subtitle: "Būsimos atostogos",
      iconBg: "bg-blue-100",
      iconColor: "text-db",
      textColor: "text-db",
    },
    remaining: {
      title: <>Likutis / Trūkumas</>,
      value: formatNumber(currentVacationDays),
      icon: Calculator,
      subtitle: todayDate,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-700",
      textColor: "text-pink-700",
    },
  };

  return (
    <div className="flex flex-row-reverse items-start justify-end gap-1 w-full relative">
      <NavigationTabs
        useGlobal={userData.useGlobal}
        userId={userData.userId}
        activeTab={activeTab}
        setActiveTab={paginate}
      />

      <div className="flex-1 relative px-6 py-6 mb-4  bg-[#EADBC8] border-blue-50 border-2 rounded-b-3xl rounded-tl-3xl">
        <div className="w-auto h-14 flex items-center bg-[#EADBC8] absolute rounded-t-2xl border-blue-50 top-0 -mt-14 -right-[2px] border-t-2 border-l-2 border-r-2">
          <span
            className={`text-3xl px-4 py-3 block font-bold text-gray-800 tracking-wide ${fredoka.className}`}
          >
            Šiandien melagio diena
          </span>
        </div>

        <div className="overflow-hidden py-1">
          <motion.div
            animate={{ height: contentHeight }}
            transition={{ duration: heightAnimationSpeed, ease: "easeOut" }}
          >
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={key}
                ref={contentRef}
                custom={direction}
                variants={slideVariants}
                initial={direction === 0 ? "center" : "enter"}
                animate="center"
                exit={direction === 0 ? "center" : "exit"}
                transition={{
                  y: { type: "tween", duration: 0.4, ease: "easeOut" },
                }}
              >
                {activeTab === "dashboard" && (
                  <DashboardContent
                    stats={stats}
                    approvedVacations={approvedFutureVacations}
                    pendingVacations={pendingVacations}
                  />
                )}
                {activeTab === "settings" && (
                  <SettingsContent usersData={usersData} />
                )}
                {activeTab === "actions" && <ActionContent />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
