/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useEffect, useState } from "react";
import nookies from "nookies";
import swal from "sweetalert";
import usePosts from "@/hooks/usePosts";
import useUser from "@/hooks/useFetchUser";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import useUserData from "@/hooks/useUserData";
import Nav from "@/components/Nav";
import SideBar from "@/components/SideBar";
import NewPost from "@/components/NewPost";
import Posts from "@/components/Posts";

interface PostData {
  user_id: number;
  name: string;
  picture: string;
  id: number;
  context: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  comments?: {
    id: number;
    content: string;
    created_at: string;
    user: {
      id: number;
      name: string;
      picture: string;
    };
  }[];
}

const Page: React.FC = () => {
  const [postData, setPostData] = useState<Array<PostData>>([]);
  const { setUserData } = useUserData();
  const [cursor, setCursor] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [newPost, setNewPost] = useState(false);
  const [postChange, setPostChange] = useState(false);
  const [commentChange, setCommentChange] = useState(false);
  const fetchPostsData = usePosts(null, cursor);
  const fetchUserData = useUser(nookies.get().user_id);
  const getPostsData = async () => {
    try {
      const data = await fetchPostsData();
      if (data) {
        setPostData(data[0]);
        setCursor(data[1]);
      }
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("貼文載入失敗", `${error}`, "error");
      }
    }
  };
  const getUserData = async () => {
    try {
      const data = await fetchUserData();
      setUserData(data);
      setApiLoading(false);
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("使用者資料載入失敗", `${error}`, "error");
      }
    }
  };
  useEffect(() => {
    setCommentChange(false);
    getPostsData();
  }, [commentChange]);
  useEffect(() => {
    setNewPost(false);
    getPostsData();
  }, [postChange, newPost]);
  useEffect(() => {
    getUserData();
  }, []);
  const fetchNextPagePostsData = async () => {
    if (cursor === null) {
      console.log("no posts!");
      return;
    }
    console.log("get the posts!");
    console.log(cursor);
    try {
      const data = await fetchPostsData();
      if (data) {
        setPostData((prevData) => [...prevData, ...data[0]]);
        setCursor(data[1]);
      }
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("貼文載入失敗", `${error}`, "error");
      }
    }
  };
  useInfiniteScroll(fetchNextPagePostsData, 100);
  return (
    <>
      <Nav userPictureChange={false} apiLoading={apiLoading} />
      <div className="xl:flex sm:flex-row flex-col justify-center lg:px-[8.5rem] pt-6">
        <div className="lg:mr-[1.875rem] hidden xl:block">
          <SideBar />
          <div>
            <p className="cursor-pointer pt-3.5 pl-7 text-base text-grey dark:text-white">
              關於我們 · 隱私權條款 · Cookie 條款 ·
            </p>
            <p className="text-base pl-7 text-grey dark:text-white">© 2023 CanChu, Inc.</p>
          </div>
        </div>
        <div className="mb-4">
          <NewPost setNewPost={setNewPost} apiLoading={apiLoading} />
          <Posts
            posts={postData}
            setPostChange={setPostChange}
            setCommentChange={setCommentChange}
            showCommentArrow={false}
            apiLoading={apiLoading}
          />
        </div>
      </div>
    </>
  );
};
export default Page;
