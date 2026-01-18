import { motion } from "framer-motion";
import { Outfit } from "next/font/google";
import { useGetAllCustomDays } from "@/app/lib/actions/customBirthDays/hooks";

const fredoka = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const CustomDayHeader = () => {
  const { data: customDayData, isLoading } = useGetAllCustomDays();

  console.log("CustomDayHeader - customDayData:", customDayData);

  if (isLoading) {
    return (
      <div className="w-auto h-14 flex items-center bg-[#EADBC8] absolute rounded-t-2xl border-blue-50 top-0 -mt-14 -right-[2px] border-t-2 border-l-2 border-r-2">
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-48 h-8 bg-[#fefaf6] rounded-md mx-4"
        />
      </div>
    );
  }

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentMonthDay = `${currentMonth
    .toString()
    .padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`;

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowMonth = tomorrow.getMonth() + 1;
  const tomorrowDay = tomorrow.getDate();
  const tomorrowMonthDay = `${tomorrowMonth
    .toString()
    .padStart(2, "0")}-${tomorrowDay.toString().padStart(2, "0")}`;

  const todayCustomDay = customDayData?.data?.find(
    (day) => day.monthDay === currentMonthDay
  );
  const tomorrowCustomDay = customDayData?.data?.find(
    (day) => day.monthDay === tomorrowMonthDay
  );

  const displayText = todayCustomDay
    ? `Šiandien ${todayCustomDay.name}`
    : tomorrowCustomDay
    ? `Rytoj ${tomorrowCustomDay.name}`
    : "Nėra jokių dienų";

  return (
    <div className="w-auto h-14 flex items-center bg-[#EADBC8] absolute rounded-t-2xl border-blue-50 top-0 -mt-14 -right-[2px] border-t-2 border-l-2 border-r-2">
      <span
        className={`text-3xl px-4 py-3 block font-bold text-gray-800 tracking-wide ${fredoka.className}`}
      >
        {displayText}
        {!todayCustomDay && !tomorrowCustomDay && (
          <span className="text-2xl">😔</span>
        )}
      </span>
    </div>
  );
};

export default CustomDayHeader;
