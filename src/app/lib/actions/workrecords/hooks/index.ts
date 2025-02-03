import { useQuery } from "@tanstack/react-query";
import { getUserMonthlyWorkRecords } from "../getUserMonthlyWorkRecords";
import { useCallback, useEffect, useState } from "react";
import { getAllUserMonthlyWorkRecords } from "../getAllUserMonthlyWorkRecords";
import { getAllMonthlyWorkRecords } from "../getAllMonthlyWorkRecords";

export const useMonthlyWorkRecords = (yearMonth: string) => {
  const [currentKey, setCurrentKey] = useState<string | undefined>();
  const [pageKeys, setPageKeys] = useState<(string | undefined)[]>([undefined]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentKey(undefined);
    setPageKeys([undefined]);
    setCurrentPage(1);
  }, [yearMonth]);

  const { data, isLoading } = useQuery({
    queryKey: ["monthlyWorkRecords", yearMonth, currentKey],
    queryFn: () => getAllMonthlyWorkRecords(yearMonth, currentKey),
  });

  const { data: nextPageData, isLoading: isCheckingNextPage } = useQuery({
    queryKey: ["monthlyWorkRecords", yearMonth, currentKey, "peek"],
    queryFn: async () => {
      if (!data?.lastEvaluatedKey) return { hasMore: false };
      return getAllMonthlyWorkRecords(yearMonth, data.lastEvaluatedKey, true);
    },
    enabled: !!data?.lastEvaluatedKey && data.data?.length === 10,
    retry: false,
  });

  const handleNextPage = useCallback(() => {
    if (data?.lastEvaluatedKey && nextPageData?.hasMore) {
      setCurrentKey(data.lastEvaluatedKey);
      setPageKeys((prev) => [...prev, data.lastEvaluatedKey]);
      setCurrentPage((prev) => prev + 1);
    }
  }, [data?.lastEvaluatedKey, nextPageData?.hasMore]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      const previousKey = pageKeys[currentPage - 2];
      setCurrentKey(previousKey);
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage, pageKeys]);

  // If we get an error while peeking, assume there's no more data
  const hasMore = nextPageData?.hasMore ?? false;

  return {
    data: data?.data ?? [],
    isLoading: isLoading || isCheckingNextPage,
    currentPage,
    hasMore,
    handleNextPage,
    handlePreviousPage,
  };
};
export const useUserWorkRecords = (userId: string, yearMonth: string) => {
  const [currentKey, setCurrentKey] = useState<string | undefined>();
  const [pageKeys, setPageKeys] = useState<(string | undefined)[]>([undefined]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentKey(undefined);
    setPageKeys([undefined]);
    setCurrentPage(1);
  }, [userId, yearMonth]);

  const { data, isLoading } = useQuery({
    queryKey: ["userWorkRecords", userId, yearMonth.slice(0, 7), currentKey],
    queryFn: async () => {
      return getUserMonthlyWorkRecords(userId, yearMonth, currentKey);
    },
  });

  const { data: nextPageData, isLoading: isCheckingNextPage } = useQuery({
    queryKey: [
      "userWorkRecords",
      userId,
      yearMonth.slice(0, 7),
      currentKey,
      "peek",
    ],
    queryFn: async () => {
      if (!data?.lastEvaluatedKey) return { hasMore: false };
      return getUserMonthlyWorkRecords(
        userId,
        yearMonth,
        data.lastEvaluatedKey,
        true
      );
    },
    enabled: !!data?.lastEvaluatedKey && data.data?.length === 10,
  });

  const handleNextPage = () => {
    if (data?.lastEvaluatedKey && nextPageData?.hasMore) {
      setCurrentKey(data.lastEvaluatedKey);
      setPageKeys((prev) => [
        ...prev,
        data.lastEvaluatedKey as string | undefined,
      ]);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const previousKey = pageKeys[currentPage - 2];
      setCurrentKey(previousKey);
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    data: data?.data ?? [],
    isLoading: isLoading || isCheckingNextPage,
    currentPage,
    hasMore: !!nextPageData?.hasMore,
    handleNextPage,
    handlePreviousPage,
  };
};

export const useGetAllUserMonthlyWorkRecordsNotFiltered = (
  userId: string,
  yearMonth: string
) => {
  console.log(yearMonth);
  return useQuery({
    queryKey: ["userWorkRecords", userId, yearMonth],
    queryFn: () => getAllUserMonthlyWorkRecords(userId, yearMonth),
  });
};
