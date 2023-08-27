"use client ";

import { useState } from "react";

const useThrottle = () => {
  const [clickTime, setClickTime] = useState(0);
  return (callback: Function) => {
    const nowTime = new Date().getSeconds();
    if (nowTime - clickTime < 1) return;
    setClickTime(nowTime);
    callback();
  };
};

export default useThrottle;
