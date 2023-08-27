"use client";

import React, { useState, useEffect } from "react";
import nookies from "nookies";
import swal from "sweetalert";
import Skeleton from "react-loading-skeleton";
import usePost from "@/hooks/usePost";
import useUser from "@/hooks/useFetchUser";
import useUserData from "@/hooks/useUserData";
import Nav from "@/components/Nav";
import Post from "@/components/Post";
import "react-loading-skeleton/dist/skeleton.css";

interface PageProps {
  params: {
    post_id: string;
  };
}
const Page: React.FC<PageProps> = ({ params }: { params: { post_id: string } }) => {
  const setUserData = useUserData((state) => state.setUserData);
  const [postChange, setPostChange] = useState(false);
  const [commentChange, setCommentChange] = useState(false);
  const [apiLoading, setApiLoading] = useState(true);
  const postData = usePost(params.post_id, postChange, commentChange, setCommentChange);
  const fetchUserData = useUser(nookies.get().user_id);
  useEffect(() => {
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
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mx-auto min-h-full bg-[#F9F9F9]">
      <Nav userPictureChange={false} apiLoading={apiLoading} />
      <div className="flex justify-center pt-[56px] dark:bg-black">
        {postData ? (
          <Post
            post={postData}
            setPostChange={setPostChange}
            setCommentChange={setCommentChange}
            showCommentArrow={true}
          />
        ) : (
          <div className="relative min-w-[43.75rem] rounded-xl bg-white dark:bg-neutral-600 border border-solid border-[#d3d3d38f] mt-4">
            <div className="mx-8 mt-2 mb-4">
              <div className="flex items-center mb-[0.938rem]">
                <Skeleton circle width="4.688rem" height="4.688rem" />
                <div className="ml-2">
                  <Skeleton width="3rem" count={2} />
                </div>
              </div>
              <div>
                <Skeleton width="6rem" count={5} />
              </div>
            </div>
            <div className="flex items-center mx-[2.188rem] p-2.5 border-y border-solid border-neutral-400">
              <Skeleton width="2rem" height="2rem" className="mr-2" />
              <Skeleton width="2rem" height="2rem" />
            </div>
            <div className="flex px-[2.188rem] py-2.5 justify-between border-b border-solid border-neutral-400">
              <Skeleton width="4.688rem" />
              <Skeleton width="4.688rem" />
            </div>
            <div className="flex justify-center py-5">
              <Skeleton circle width="3.25rem" height="3.25rem" className="mr-3" />
              <Skeleton width="20rem" height="3.25rem" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
