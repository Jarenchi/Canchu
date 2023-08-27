/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import nookies from "nookies";
import styled from "styled-components";
import Image from "next/image";
import swal from "sweetalert";
import useEvents from "@/hooks/useEvents";
import Bell from "@/public/images/bell.png";
import BlueBell from "@/public/images/blue-bell.png";
import CheckCircle from "@/public/images/checkCircle.png";

const DropdownList = styled.div`
  .clickarea {
    position: absolute;
    width: 300px;
    height: 460px;
    top: 0;
    right: 0;
    display: none;
  }
  &:hover > .clickarea {
    display: block;
  }
`;
function getRelativeTime(datetimeString: string) {
  const timeStamp = new Date(datetimeString).getTime();
  const currentTime = Date.now();
  const diffMilliseconds = Math.abs(timeStamp - currentTime);
  const seconds = Math.floor(diffMilliseconds / 1000);
  const minutes = Math.floor(diffMilliseconds / (1000 * 60));
  const hours = Math.floor(diffMilliseconds / (1000 * 60 * 60));
  const days = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
  if (minutes > 7200) {
    return datetimeString;
  }
  if (minutes > 1440) {
    return `${days} 天前`;
  }
  if (minutes > 60) {
    return `${hours} 小時前`;
  }
  if (seconds > 60) {
    return `${minutes} 分鐘前`;
  }
  return "剛剛";
}

interface Event {
  id: string;
  type: string;
  is_read: number;
  image: string | null;
  created_at: string;
  summary: string;
}
const NotificationPanel = () => {
  const [notificationsData, setNotificationsData] = useState<Array<Event>>([]);
  const fetchNotificationData = useEvents();
  const [isRead, setIsRead] = useState(false);
  useEffect(() => {
    const getNotificationData = async () => {
      try {
        const data = await fetchNotificationData;
        if (data) {
          setNotificationsData(data);
        }
      } catch (error: any) {
        if (error?.response?.status >= 500 && error?.response?.status < 600) {
          swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
        } else {
          swal("訊息載入失敗", `${error}`, "error");
        }
      }
    };
    getNotificationData();
    setIsRead(false);
  }, [isRead]);
  async function readEvent(event_id: string) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${event_id}/read`,
        { event_id },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      );
      console.log(response);
      setIsRead(true);
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("訊息載入失敗", `${error}`, "error");
      }
    }
  }
  const notificationsItems = notificationsData?.map((event: Event) => (
    <div
      className={`relative flex border-b pt-2 bg-[#F6F6F6] dark:bg-neutral-600 ${event.is_read === 1 && "opacity-50"}`}
      key={event.id}
    >
      <div className="w-[80%] mb-2">
        <p className="font-medium font-outfit">{event.summary}</p>
        <p className="text-sm font-bold leading-6 text-berry-blue font-outfit">{getRelativeTime(event.created_at)}</p>
      </div>
      {event.is_read !== 1 && (
        <button type="button" onClick={() => readEvent(event.id)} className="absolute right-5 top-5">
          <Image src={CheckCircle} alt="check-circle" width={12} height={12} />
        </button>
      )}
    </div>
  ));
  const unreadCount = notificationsData.filter((event) => event.is_read === 0).length;
  return (
    <DropdownList className="relative cursor-pointer mr-3.5">
      <div className="relative">
        <Image src={Bell} alt="notification-icon" width={40} height={40} />
        <div className="bg-[#DE3F4F] w-5 h-5 rounded-full flex items-center justify-center text-white absolute -top-1 -right-1 text-xs">
          {unreadCount}
        </div>
      </div>
      <div className="clickarea">
        <div className="relative z-10 top-20">
          <div className="flex items-center bg-berry-blue px-[1.125rem] py-[0.813rem] rounded-t-[1.3rem]">
            <Image src={BlueBell} alt="notification-icon" width={38} height={38} />
            <span className="font-outfit font-bold text-white ml-[1.125rem] mr-[5.5rem] text-[1.3rem] leading-6">
              我的通知
            </span>
          </div>
          <div className="bg-[#F6F6F6] dark:bg-neutral-600 rounded-b-[1.3rem] py-3 px-3 flex flex-col max-h-[17rem] overflow-auto">
            {notificationsData.length === 0 ? <p className="py-4 text-center">目前沒有訊息</p> : notificationsItems}
          </div>
        </div>
      </div>
    </DropdownList>
  );
};

export default NotificationPanel;
