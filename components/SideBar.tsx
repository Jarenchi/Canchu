"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import nookies from "nookies";
import axios from "axios";
import swal from "sweetalert";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "next-themes";
import "react-loading-skeleton/dist/skeleton.css";
import useFetchFriendsRequestsData from "@/hooks/useFetchFriendsRequests";
import useFetchFriendsData from "@/hooks/useFetchFriendsData";
import useUserData from "@/hooks/useUserData";
import Options from "@/public/images/options.png";
import Friends from "@/public/images/friends.png";
import WhiteFriends from "@/public/images/white-friends.png";
import ProfileUser from "@/public/images/profile-user.png";

interface Friend {
  id: number;
  name: string;
  picture: string | null;
  friendship?: {
    id: number;
    status: string | null;
  };
}
const SideBar: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { userData } = useUserData();
  const [friendRequestChange, setFriendRequestChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const friendsRequestData = useFetchFriendsRequestsData(friendRequestChange, setFriendRequestChange);
  const { friendsData, apiLoading } = useFetchFriendsData(friendRequestChange, setFriendRequestChange);
  async function friendAgreeHandler(friendshipId: number, friendName: string) {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/friends/${friendshipId}/agree`,
        { friendship_id: friendshipId },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      );
      console.log(response);
      setFriendRequestChange(true);
      swal(`已接受${friendName}的好友邀請`, "開始和新朋友聊天吧", "success");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal(`無法接受${friendName}的好友邀請`, `${error}`, "error");
      }
    }
    setLoading(false);
  }
  async function friendDisagreeHandler(friendshipId: number, friendName: string) {
    setLoading(true);
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/friends/${friendshipId}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        params: { friendship_id: friendshipId },
      });
      console.log(response);
      setFriendRequestChange(true);
      swal(`已取消${friendName}的好友邀請`, "", "success");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("無法取消好友邀請", `${error}`, "error");
      }
    }
    setLoading(false);
  }
  const friendRequesetItems = friendsRequestData.slice(0, expanded ? undefined : 6).map((friend: Friend) => (
    <div key={friend.id} className="cursor-pointer flex items-center mb-2.5 justify-between">
      <Link href={`/user/${friend.id}`} className="flex items-center">
        {friend?.picture ? (
          <div className="relative overflow-hidden cursor-pointer rounded-full w-[2.625rem] h-[2.625rem] mr-3.5">
            <Image src={friend.picture} alt={friend.name || "未知使用者"} fill={true} className="object-cover" />
          </div>
        ) : (
          <div className="w-[2.625rem] h-[2.625rem] bg-neutral-300 rounded-full mr-3.5 border border-solid border-inherit" />
        )}
        <p className="text-lg font-bold leading-6 break-words whitespace-pre-wrap font-outfit">{friend.name}</p>
      </Link>
      <div>
        <button
          type="button"
          disabled={loading}
          onClick={() => friendAgreeHandler(Number(friend.friendship?.id), friend.name)}
          className="px-4 py-2 mr-2 text-base text-white rounded-md bg-berry-blue font-outfit disabled:opacity-50"
        >
          確認
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => friendDisagreeHandler(Number(friend.friendship?.id), friend.name)}
          className="px-4 py-2 text-base text-white rounded-md bg-neutral-400 font-outfit disabled:opacity-50"
        >
          取消
        </button>
      </div>
    </div>
  ));
  const friendItems = friendsData.slice(0, expanded ? undefined : 6).map((friend: Friend) => (
    <Link href={`/user/${friend.id}`} key={friend.id} className="cursor-pointer flex items-center mb-2.5">
      {friend?.picture ? (
        <div className="relative overflow-hidden cursor-pointer rounded-full w-[2.625rem] h-[2.625rem] mr-3.5">
          <Image src={friend.picture} alt={friend.name || "未知使用者"} fill={true} className="object-cover" />
        </div>
      ) : (
        <div className="w-[2.625rem] h-[2.625rem] bg-neutral-300 rounded-full mr-3.5 border border-solid border-inherit" />
      )}
      <p className="text-lg font-bold leading-6 font-outfit">{friend.name}</p>
    </Link>
  ));
  const shouldDisplayExpandButton = friendsRequestData.length > 6 || friendsData.length > 6;
  return (
    <div className="py-5 px-[1.563rem] min-w-[23.313rem] bg-white dark:bg-neutral-600 rounded-[1.25rem] border">
      <div className="flex items-center cursor-pointer mb-7">
        {apiLoading ? (
          <Skeleton circle width="2.625rem" height="2.625rem" className="mr-3.5" />
        ) : (
          <>
            <Link href={`/user/${userData.id}`}>
              {userData.picture ? (
                <div className="relative overflow-hidden cursor-pointer rounded-full w-[2.625rem] h-[2.625rem] mr-3.5">
                  <Image
                    src={userData.picture}
                    alt={userData.name || "未知使用者"}
                    fill={true}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="mr-3.5">
                  <Image src={ProfileUser} alt={userData.name || "未知使用者"} width={42} height={42} />
                </div>
              )}
            </Link>
          </>
        )}
        <Link href={`/user/${userData.id}`} className="text-lg font-bold leading-6 font-outfit">
          {apiLoading ? <Skeleton width={70} /> : userData.name || "你的名字"}
        </Link>
      </div>
      <div className="pt-5 border-t">
        <div className="cursor-pointer flex items-center pl-2 mb-3.5">
          {theme === "dark" ? (
            <Image src={WhiteFriends} alt="friends-icon" width={26.79} height={25} />
          ) : (
            <Image src={Friends} alt="friends-icon" width={26.79} height={25} />
          )}
          <p className="pl-5 font-outfit font-bold text-lg leading-6 text-[#767676] dark:text-white">我的好友</p>
        </div>
        {apiLoading ? (
          <div>
            <div className="flex mb-2">
              <Skeleton circle width="2.625rem" height="2.625rem" className="mr-3.5" />
              <Skeleton width="6rem" height="1rem" />
            </div>
            <div className="flex mb-2">
              <Skeleton circle width="2.625rem" height="2.625rem" className="mr-3.5" />
              <Skeleton width="6rem" height="1rem" />
            </div>
            <div className="flex mb-2">
              <Skeleton circle width="2.625rem" height="2.625rem" className="mr-3.5" />
              <Skeleton width="6rem" height="1rem" />
            </div>
            <div className="flex mb-2">
              <Skeleton circle width="2.625rem" height="2.625rem" className="mr-3.5" />
              <Skeleton width="6rem" height="1rem" />
            </div>
            <div className="flex mb-2">
              <Skeleton circle width="2.625rem" height="2.625rem" className="mr-3.5" />
              <Skeleton width="6rem" height="1rem" />
            </div>
          </div>
        ) : (
          <div>
            {friendsRequestData && friendRequesetItems}
            {friendsData === undefined ? (
              <p className="text-lg font-medium leading-6 text-black font-outfit pt-[0.3rem] text-center">
                目前沒有朋友
              </p>
            ) : (
              friendItems
            )}
            {shouldDisplayExpandButton && !expanded && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="cursor-pointer flex items-center pt-[0.3rem]"
              >
                <Image src={Options} alt="options-icon" width={39} height={39} />
                <p className="ml-5 text-lg font-medium leading-6 text-black font-outfit">查看全部</p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
