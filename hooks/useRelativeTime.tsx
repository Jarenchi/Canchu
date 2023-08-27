import { useState, useEffect } from "react";

function useRelativeTime(datetimeString: string): string {
  const [relativeTime, setRelativeTime] = useState<string>("剛剛");
  useEffect(() => {
    const updateRelativeTime = () => {
      const timeStamp = new Date(datetimeString).getTime();
      const currentTime = Date.now();
      const diffMilliseconds = Math.abs(timeStamp - currentTime);
      const seconds = Math.floor(diffMilliseconds / 1000);
      const minutes = Math.floor(diffMilliseconds / (1000 * 60));
      const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
      const days = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
      if (minutes > 7200) {
        setRelativeTime(datetimeString);
      } else if (minutes > 1440) {
        setRelativeTime(`${days} 天前`);
      } else if (minutes > 60) {
        setRelativeTime(`${hours} 小時前`);
      } else if (seconds > 60) {
        setRelativeTime(`${minutes} 分鐘前`);
      } else {
        setRelativeTime("剛剛");
      }
    };
    updateRelativeTime();
  }, [datetimeString]);
  return relativeTime;
}

export default useRelativeTime;
