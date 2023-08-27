"use client";

import { useState } from "react";

const useDebounce = () => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  return (callback: Function, delay: number) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    setDebounceTimer(
      setTimeout(() => {
        callback();
      }, delay),
    );
  };
};

export default useDebounce;
