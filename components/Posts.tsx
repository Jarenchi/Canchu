import Image from "next/image";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Loading from "@/public/images/loading.png";
import Post from "./Post";

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

interface PostsProps {
  posts: Array<PostData>;
  setPostChange: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentChange: React.Dispatch<React.SetStateAction<boolean>>;
  showCommentArrow: boolean;
  apiLoading: boolean;
}

const Posts: React.FC<PostsProps> = ({ posts, setPostChange, setCommentChange, showCommentArrow, apiLoading }) => {
  if (apiLoading) {
    return (
      <>
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
        <Image src={Loading} alt="loading-icon" width={34.18} height={7} className="py-5 m-auto cursor-pointer" />
      </>
    );
  }
  if (posts.length === 0 && !apiLoading) {
    return (
      <p className="flex font-sans text-lg font-medium py-10 justify-center pb-[40rem] pt-28 px-60">目前沒有新貼文</p>
    );
  }
  return (
    <>
      {posts.map((post) => (
        <div className="mt-[1.25rem]" key={post.id}>
          <Post
            post={post}
            setPostChange={setPostChange}
            setCommentChange={setCommentChange}
            showCommentArrow={showCommentArrow}
          />
        </div>
      ))}
    </>
  );
};

export default Posts;
