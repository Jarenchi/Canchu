import { useEffect } from "react";

const useInfiniteScroll = (callback: () => void, distanceFromBottom = 100) => {
  useEffect(() => {
    const scrollHandler = () => {
      const isNearBottom =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) < distanceFromBottom;
      if (isNearBottom) {
        window.removeEventListener("scroll", scrollHandler);
        callback();
      }
    };
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [callback, distanceFromBottom]);
};

export default useInfiniteScroll;
