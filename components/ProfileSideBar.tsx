/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useUser from "@/hooks/useFetchUser";

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}
const buttonStyle =
  "py-2 px-[30%] text-white font-outfit text-base font-bold rounded-md bg-berry-blue disabled:bg-neutral-300";
const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, children }) => (
  <button type="button" onClick={onClick} disabled={disabled} className={buttonStyle}>
    {children}
  </button>
);
interface User {
  id: number;
  name: string;
  picture: string | null;
  friend_count: number;
  introduction: string | null;
  tags: string | null;
  friendship: {
    id: number;
    status: string;
  };
}
interface ProfileSideBarProps {
  isAbleToEdit: boolean;
  userId: string;
  friendRequestChange: boolean;
  setFriendRequestChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSideBar: React.FC<ProfileSideBarProps> = ({
  isAbleToEdit,
  userId,
  friendRequestChange,
  setFriendRequestChange,
}) => {
  const router = useRouter();
  const [userData, setUserData] = useState<User>();
  const [editProfile, setEditProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const [submitProfile, setSubmitProfile] = useState(false);
  const [friendshipId, setFriendshipId] = useState<number>();
  const introRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLTextAreaElement>(null);
  const fetchUserData = useUser(userId);
  const getUserData = async () => {
    setFriendRequestChange(false);
    try {
      const data = await fetchUserData();
      setUserData(data);
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("使用者資料載入失敗", `${error}`, "error");
      }
    }
  };
  useEffect(() => {
    getUserData();
    setApiLoading(false);
  }, [friendRequestChange, setFriendRequestChange]);
  useEffect(() => {
    getUserData();
    setApiLoading(false);
  }, [submitProfile]);
  function removeDuplicateTags(str: string) {
    const tags = str.split(",");
    const uniqueTags = [...new Set(tags.map((tag) => tag.trim()))];
    const filteredTags = uniqueTags.filter((tag) => tag.length > 0);
    return filteredTags.join(",");
  }
  async function profileSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const cleanedTags = removeDuplicateTags(tagsRef.current?.value ?? "");
    const url = `${process.env.NEXT_PUBLIC_API_URL}/users/profile`;
    const params = {
      name: nookies.get().user_name,
      introduction: introRef.current?.value,
      tags: cleanedTags,
    };
    const headers = {
      headers: { Authorization: `Bearer ${nookies.get().access_token} ` },
    };
    try {
      const response = await axios.put(url, params, headers);
      console.log(response);
      setSubmitProfile(true);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("上傳失敗", `${error}`, "error");
      }
    }
    setLoading(false);
    setEditProfile(false);
  }
  async function friendRequestHandler() {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/friends/${userId}/request`;
    const params = { user_id: userId };
    const headers = {
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    };
    try {
      const response = await axios.post(url, params, headers);
      console.log(response);
      setFriendshipId(response.data.data.friendship.id);
      setFriendRequestChange(true);
      swal("好友邀請已送出", "等對方回覆囉!", "success");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("好友邀請送出失敗", `${error}`, "error");
      }
    }
    setLoading(false);
  }
  async function deleteFriendOrRequestHandler(isFriendRequest: boolean) {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/friends/${friendshipId}`;
    const headers = { Authorization: `Bearer ${nookies.get().access_token}` };
    const params = { friendship_id: Number(friendshipId) };
    try {
      const response = await axios.delete(url, { headers, params });
      console.log(response);
      setFriendRequestChange(true);
      swal(isFriendRequest ? "好友邀請已刪除" : "已刪除好友", "", "success");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal(isFriendRequest ? "無法刪除好友邀請" : "無法刪除好友", `${error}`, "error");
      }
    }
    setLoading(false);
  }
  async function friendAgreeHandler(friendship_Id: number, friendName: string) {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/friends/${friendshipId}`;
    try {
      const response = await axios.post(
        url,
        { friendship_id: friendship_Id },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      );
      console.log(response);
      swal(`已接受${friendName}的好友邀請`, "開始和新朋友聊天吧", "success");
      setFriendRequestChange(true);
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
  const tags = userData?.tags?.split(",");
  const TagItems = tags?.map((tag: string) => (
    <span
      key={tag}
      className="mt-3.5 cursor-pointer border rounded-[50px] border-black dark:border-white dark:text-white px-2 py-2 mr-3 hover:text-white hover:bg-berry-blue hover:border-white"
    >
      {tag}
    </span>
  ));
  return (
    <div className="flex flex-col items-center xl:max-w-[25.375rem] lg:max-w-[48.25rem] max-w-full lg:min-w-[25.375rem] min-w-full bg-white dark:bg-neutral-600 rounded-[1.25rem] pt-[1.483rem] pb-11 px-3 border">
      {isAbleToEdit && (
        <ActionButton onClick={() => setEditProfile(true)} disabled={editProfile === true}>
          編輯個人檔案
        </ActionButton>
      )}
      {userData?.friendship === null && !isAbleToEdit && (
        <ActionButton onClick={() => friendRequestHandler()} disabled={loading}>
          邀請成為好友
        </ActionButton>
      )}
      {userData?.friendship?.status === "requested" && (
        <ActionButton onClick={() => deleteFriendOrRequestHandler(true)} disabled={loading}>
          刪除好友邀請
        </ActionButton>
      )}
      {userData?.friendship?.status === "pending" && (
        <ActionButton
          onClick={() => friendAgreeHandler(Number(userData.friendship?.id), userData.name)}
          disabled={loading}
        >
          接受好友邀請
        </ActionButton>
      )}
      {userData?.friendship?.status === "friend" && (
        <ActionButton onClick={() => deleteFriendOrRequestHandler(false)} disabled={loading}>
          刪除好友
        </ActionButton>
      )}
      {apiLoading && <Skeleton width="19rem" height="2rem" />}
      {editProfile === true ? (
        <form
          method="put"
          className="mt-5 pb-2 px-[1.875rem] flex flex-col items-center"
          onSubmit={profileSubmitHandler}
        >
          <label htmlFor="introduction">
            <p className="text-lg font-bold leading-6 font-outfit text-grey dark:text-white">自我介紹</p>
            <textarea
              ref={introRef}
              defaultValue={userData?.introduction || ""}
              className="resize-none min-w-[20rem] min-h-[5.25rem] mt-2.5 p-2 dark:text-black bg-[#F0F2F5] border border-neutral-400 rounded-[0.625rem] focus:outline-none"
            />
          </label>
          <label htmlFor="tags">
            <p className="pt-4 text-lg font-bold leading-6 font-outfit text-grey dark:text-white">興趣</p>
            <textarea
              ref={tagsRef}
              defaultValue={userData?.tags || ""}
              className="resize-none min-w-[20rem] min-h-[5.25rem] mt-2.5 p-2 dark:text-black bg-[#F0F2F5] border border-neutral-400 rounded-[0.625rem] focus:outline-none"
            />
          </label>
          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className="text-base font-bold text-white font-outfit py-2.5 bg-berry-blue px-[1.875rem] rounded-md mr-[1.125rem] disabled:opacity-50"
            >
              確認
            </button>
            <button
              type="button"
              onClick={() => {
                setEditProfile(false);
              }}
              className="text-base font-bold text-white font-outfit py-2.5 bg-neutral-300 px-[1.875rem] rounded-md"
            >
              取消
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 pb-2 min-w-[20.25rem]">
          <p className="text-lg font-bold leading-6 font-outfit text-grey dark:text-white">自我介紹</p>
          {apiLoading ? (
            <Skeleton width="2rem" />
          ) : (
            <p className="pt-2 text-base font-medium break-words whitespace-pre-wrap font-outfit">
              {userData?.introduction || "目前沒有"}
            </p>
          )}
          <p className="pt-4 text-lg font-bold leading-6 font-outfit text-grey dark:text-white">興趣</p>
          {apiLoading ? (
            <Skeleton width="2rem" />
          ) : (
            <p className="flex flex-wrap text-base font-medium text-black whitespace-pre-wrap dark:text-white font-outfit">
              {userData?.tags ? TagItems : "目前沒有"}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
export default ProfileSideBar;
