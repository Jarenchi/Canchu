"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileUser from "@/public/images/profile-user.png";
import useUserData from "@/hooks/useUserData";

interface NewPostProps {
  setNewPost: React.Dispatch<React.SetStateAction<boolean>>;
  apiLoading: boolean;
}
const NewPost: React.FC<NewPostProps> = ({ setNewPost, apiLoading }) => {
  const router = useRouter();
  const { userData } = useUserData();
  const NewPostRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  async function newPostSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        {
          context: NewPostRef.current?.value,
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } },
      );
      console.log(response);
      swal("貼文已上傳", "", "success");
      setNewPost(true);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("貼文上傳失敗", `${error}`, "error");
      }
    }
    if (NewPostRef.current?.value) NewPostRef.current.value = "";
    setLoading(false);
  }
  return (
    <div className="flex items-start lg:max-w-[48.25rem] md:min-w-[40rem] min-w-full bg-white dark:bg-neutral-600 rounded-[1.3rem] py-5 md:px-6 px-3 border border-solid border-neutral-300">
      {apiLoading ? (
        <Skeleton circle width={74} height={74} />
      ) : (
        <div>
          <Link href={`/user/${userData.id}`}>
            <div className="relative overflow-hidden cursor-pointer rounded-full w-[4.625rem] h-[4.625rem]">
              {userData.picture ? (
                <Image
                  src={userData.picture}
                  alt={userData.name || "未知使用者"}
                  fill={true}
                  className="object-cover"
                />
              ) : (
                <Image src={ProfileUser} alt={userData.name || "未知使用者"} width={74} height={74} />
              )}
            </div>
          </Link>
        </div>
      )}
      <form onSubmit={newPostSubmitHandler}>
        <textarea
          required
          ref={NewPostRef}
          placeholder="說點什麼嗎?"
          className="block resize-none lg:min-w-[39rem] md:min-w-[80vw] sm:min-w-[70vw] min-w-[60vw] min-h-[6.25rem] ml-6 mb-3.5 px-4 pt-4 dark:text-black bg-[#F0F2F5] rounded-[0.625rem] border border-[#D9D9D9] placeholder:font-outfit placeholder:text-lg placeholder:leading-6 placeholder:font-normal placeholder:text-[#767676] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="float-right px-[2.125rem] py-2 text-white font-outfit font-normal text-lg leading-6 rounded-md bg-berry-blue"
        >
          發佈貼文
        </button>
      </form>
    </div>
  );
};

export default NewPost;
