"use client";
import { User } from "../types/api";

import { FaHandPeace } from "react-icons/fa6";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const UserSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 mb-8 ">
      <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

interface UserInfoProps {
  userData: User;
}

const UserInfo = ({ userData }: UserInfoProps) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return {
        text: "Labas rytas",
        icon: <FaHandPeace className="text-[#E9A362] h-7 w-7" />,
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        text: "Labas",
        icon: <FaHandPeace className="text-[#E9A362] h-7 w-7" />,
      };
    } else {
      return {
        text: "Labas vakaras",
        icon: <FaHandPeace className="text-[#E9A362] h-7 w-7" />,
      };
    }
  };

  const { text, icon } = getTimeBasedGreeting();

  return (
    <div className="flex items-center justify-start w-full max-w-2xl mb-8 px-4">
      <div className="flex items-center gap-4">
        <h1
          className={`text-3xl font-bold text-gray-800 tracking-wide ${fredoka.className}`}
        >
          {text},<span className="ml-2">{userData.name}</span>
        </h1>
        <div className="flex items-center justify-center">{icon}</div>
      </div>
    </div>
  );
};

export default UserInfo;
