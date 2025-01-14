export const formatDate = (date: string | Date) => 
    new Date(date).toLocaleDateString("lt-LT");
  
  export const formatNumber = (value: number) => {
    const withThreeDecimals = Number(value).toFixed(3);
    return withThreeDecimals.replace(/\.?0+$/, "");
  };