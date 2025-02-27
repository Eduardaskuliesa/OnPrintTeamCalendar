/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Vacation } from "../../../../types/api";
import NavigationTabs from "./NavigationTabs";
import DashboardContent from "./tabs/VacationContent/index.";
import SettingsContent from "./tabs/SettingsContent";
import CustomAndBirghtDays from "./tabs/CustomAndBirghtDays";
import CustomDayHeader from "./CustomDayHeader";


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

const TABS = ["dashboard", "customDays", "settings"];

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
  const [isDataReady, setIsDataReady] = useState(false);
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
  const updateHeight = () => {
    if (contentRef.current) {
      const newHeight = contentRef.current.offsetHeight;
      setContentHeight(`${newHeight}px`);
    }
  };

  useEffect(() => {
    updateHeight();

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

  const approvedFutureVacations = futureVacationsList.filter(
    (vacation) => vacation.status === "APPROVED"
  );

  const pendingVacations = futureVacationsList.filter(
    (vacation) => vacation.status === "PENDING"
  );

  useEffect(() => {
    updateHeight();
  }, [
    isDataReady,
    pendingVacations,
    approvedFutureVacations,
    realCurrentBalance,
    futureVacationsList,
  ]);

  return (
    <div className="flex flex-row-reverse items-start justify-end gap-1 w-full relative">
      <NavigationTabs
        useGlobal={userData.useGlobal}
        userData={userData}
        activeTab={activeTab}
        setActiveTab={paginate}
      />

      <div className="flex-1 relative px-6 py-6 mb-4  bg-[#EADBC8] border-blue-50 border-2 rounded-b-3xl rounded-tl-3xl">
        <CustomDayHeader></CustomDayHeader>

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
                    realCurrentBalance={realCurrentBalance}
                    totalFutureVacationDays={totalFutureVacationDays}
                    currentVacationDays={currentVacationDays}
                    approvedVacations={approvedFutureVacations}
                    pendingVacations={pendingVacations}
                  />
                )}
                {activeTab === "customDays" && (
                  <CustomAndBirghtDays
                    userId={userData.userId}
                    isDataReady={setIsDataReady}
                  />
                )}
                {activeTab === "settings" && (
                  <SettingsContent usersData={usersData} userData={userData} />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
