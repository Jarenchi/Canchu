/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import React, { useEffect, useState } from "react";
import nookies from "nookies";
import swal from "sweetalert";
import usePosts from "@/hooks/usePosts";
import useUser from "@/hooks/useFetchUser";
import useUserData from "@/hooks/useUserData";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import Nav from "@/components/Nav";
import ProfileSideBar from "@/components/ProfileSideBar";
import NewPost from "@/components/NewPost";
import ProfileBanner from "@/components/ProfileBanner";
import Posts from "@/components/Posts";

interface PageProps {
  params: {
    user_id: string;
  };
}
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
const Page: React.FC<PageProps> = ({ params }: { params: { user_id: string } }) => {
  const [postData, setPostData] = useState<Array<PostData>>([]);
  const { setUserData } = useUserData();
  const [cursor, setCursor] = useState<string | null>(null);
  const [newPost, setNewPost] = useState(false);
  const [userPictureChange, setUserPictureChange] = useState(false);
  const [commentChange, setCommentChange] = useState(false);
  const [postChange, setPostChange] = useState(false);
  const [friendRequestChange, setFriendRequestChange] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const fetchPostsData = usePosts(params.user_id, cursor);
  const fetchUserData = useUser(params.user_id);
  const getPostsData = async () => {
    try {
      const postdata = await fetchPostsData();
      if (postdata) {
        setPostData(postdata[0]);
        setCursor(postdata[1]);
      }
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("貼文資料載入失敗", `${error}`, "error");
      }
    }
  };
  const getUserData = async () => {
    try {
      const userdata = await fetchUserData();
      setUserData(userdata);
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
    setNewPost(false);
    getPostsData();
  }, [newPost, postChange]);
  useEffect(() => {
    setUserPictureChange(false);
    getPostsData();
  }, [userPictureChange]);
  useEffect(() => {
    setCommentChange(false);
    getPostsData();
  }, [commentChange]);
  useEffect(() => {
    setUserPictureChange(false);
    getUserData();
  }, [userPictureChange]);
  useEffect(() => {
    setFriendRequestChange(false);
    getUserData();
  }, [friendRequestChange]);
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
        swal("貼文資料載入失敗", `${error}`, "error");
      }
    }
  };
  useInfiniteScroll(fetchNextPagePostsData, 100);
  const isAbleToEdit = nookies.get().user_id === params.user_id;
  return (
    <>
      <Nav userPictureChange={userPictureChange} apiLoading={apiLoading} />
      <ProfileBanner setUserPictureChange={setUserPictureChange} isAbleToEdit={isAbleToEdit} apiLoading={apiLoading} />
      <div className="flex-col justify-center pt-6 xl:flex sm:flex-row">
        <div className="lg:mr-[1.875rem] mb-3 lg:mb-0">
          <ProfileSideBar
            isAbleToEdit={isAbleToEdit}
            userId={params.user_id}
            friendRequestChange={friendRequestChange}
            setFriendRequestChange={setFriendRequestChange}
          />
          <div className="hidden xl:block xl:min-w-[25.375rem]">
            <p className="cursor-pointer pt-3.5 pl-7 text-base text-grey dark:text-white">
              關於我們 · 隱私權條款 · Cookie 條款 ·
            </p>
            <p className="text-base pl-7 text-grey dark:text-white">© 2023 CanChu, Inc.</p>
          </div>
        </div>
        <div className="mb-4">
          {isAbleToEdit && <NewPost setNewPost={setNewPost} apiLoading={false} />}
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
