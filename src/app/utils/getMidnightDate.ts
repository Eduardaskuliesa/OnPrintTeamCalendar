export const getMidnightDate = () => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now;
};
