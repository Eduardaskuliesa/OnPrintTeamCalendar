import { useState, useCallback } from "react";

export function useNumericInput(initialValue: number) {
  // Always initialize with the string representation of the number
  const [value, setValue] = useState(String(initialValue));

  const handleChange = useCallback((newValue: string) => {
    // Allow empty string while typing
    if (newValue === "") {
      setValue("");
      return;
    }

    const sanitized = newValue.replace(/[^\d]/g, "");

    const withoutLeadingZeros = sanitized.replace(/^0+(\d)/, "$1");

    setValue(withoutLeadingZeros || "0");
  }, []);

  const parseValue = useCallback(() => {
    if (value === "" || isNaN(parseInt(value))) {
      return 0;
    }
    return parseInt(value);
  }, [value]);

  return {
    value,
    setValue: handleChange,
    parseValue,
  };
}
