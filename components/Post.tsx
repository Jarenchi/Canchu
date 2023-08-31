"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";
import { useTheme } from "next-themes";
import DOMPurify from "dompurify";
import useUserData from "@/hooks/useUserData";
import useThrottle from "@/hooks/useThrottle";
import OutlineHeart from "@/public/images/outline-heart.png";
import WhiteOutlineHeart from "@/public/images/white-outline-heart.png";
import FilledHeart from "@/public/images/filled-heart.png";
import CommentIcon from "@/public/images/comment.png";
import WhiteCommentIcon from "@/public/images/white-comment.png";
import ProfileUser from "@/public/images/profile-user.png";
import Arrow from "@/public/images/arrow.png";
import Edit from "@/public/images/edit.png";
import useRelativeTime from "@/hooks/useRelativeTime";
import config from "@/lib/joditConfig";
import Comment from "./Comment";

interface PostProps {
  post: {
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
  };
  setPostChange: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentChange: React.Dispatch<React.SetStateAction<boolean>>;
  showCommentArrow: boolean;
}

const Post: React.FC<PostProps> = ({ post, setPostChange, setCommentChange, showCommentArrow }) => {
  const { userData } = useUserData();
  const JoditEditor = useMemo(() => dynamic(() => import("jodit-react"), { ssr: false }), []);
  const { theme } = useTheme();
  const router = useRouter();
  const [likeCount, setLikeCount] = useState<number>(post.like_count);
  const [liked, setLiked] = useState<boolean>(post.is_liked);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [editPost, setEditPost] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const relativeTime = useRelativeTime(post.created_at);
  const [postContextValue, setPostContextValue] = useState(post.context);
  const contextRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (contextRef.current) {
      if (contextRef.current.scrollHeight > 100) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    }
  }, []);

  async function postUpdateSubmitHandler() {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        { id: post.id, context: postContextValue },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      );
      console.log(response);
      setPostChange(true);
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("無法更新貼文", `${error}`, "error");
      }
    }
  }
  const throttle = useThrottle();
  async function createLikeHandler() {
    throttle(async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}/like`,
          { id: post.id },
          {
            headers: { Authorization: `Bearer ${nookies.get().access_token}` },
          },
        );
        console.log(response);
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          swal("帳號已過期", "請重新登入", "error");
          router.push("/login");
        }
        if (error?.response?.status >= 500 && error?.response?.status < 600) {
          swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
        } else {
          swal("無法按讚", `${error}`, "error");
        }
      }
    });
  }
  async function deleteLikeHandler() {
    throttle(async () => {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}/like`, {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        });
        console.log(response);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          swal("帳號已過期", "請重新登入", "error");
          router.push("/login");
        }
        if (error?.response?.status >= 500 && error?.response?.status < 600) {
          swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
        } else {
          swal("無法收回讚", `${error}`, "error");
        }
      }
    });
  }
  async function submitComment() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}/comment`,
        { id: post.id, content: commentRef.current?.value },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        },
      );
      console.log(response);
      setCommentChange(true);
      swal("已新增留言", "", "success");
    } catch (error: any) {
      if (error.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("留言新增失敗", `${error}`, "error");
      }
    }
    if (commentRef.current) {
      commentRef.current.value = "";
    }
  }
  async function commentSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submitComment();
  }
  async function KeyDownCommentSubmitHandler(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitComment();
    }
  }
  const CommentItems = post.comments?.map((comment) => <Comment key={comment.id} comment={comment} />);
  const isAbleToEdit = post.user_id === userData.id;
  const editPostArea = (
    <form>
      <JoditEditor value={postContextValue} config={config} onChange={setPostContextValue} />
      <div className="mt-3">
        <button
          type="submit"
          onClick={postUpdateSubmitHandler}
          className="text-base font-bold text-white font-outfit py-2.5 bg-berry-blue px-[1.875rem] rounded-md mr-[1.125rem] disabled:opacity-50"
        >
          確認
        </button>
        <button
          type="button"
          onClick={() => setEditPost(false)}
          className="text-base font-bold text-white font-outfit py-2.5 bg-neutral-300 px-[1.875rem] rounded-md"
        >
          取消
        </button>
      </div>
    </form>
  );
  const postContext = post.context ? (
    <div ref={contextRef}>
      {expanded ? (
        <div
          className="break-words whitespace-pre-wrap"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.context) }}
        />
      ) : (
        <div
          className="max-h-[6.25rem] overflow-hidden break-words whitespace-pre-wrap"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.context) }}
        />
      )}
      {!expanded && (
        <button type="button" onClick={() => setExpanded(true)} className="text-neutral-500 dark:text-white">
          顯示全部
        </button>
      )}
    </div>
  ) : (
    <p className="text-slate-300">內文空白</p>
  );
  return (
    <div
      key={post.id}
      className="relative lg:min-w-[48.25rem] max-w-full rounded-xl bg-white dark:bg-neutral-600 border border-solid border-[#d3d3d38f] group"
    >
      <div className="mx-8 mt-2 mb-4">
        {isAbleToEdit && (
          <button
            type="button"
            onClick={() => {
              setEditPost(true);
            }}
          >
            <Image
              src={Edit}
              alt="edit-icon"
              width={24}
              height={24}
              className="absolute hidden cursor-pointer group-hover:block top-3 right-3"
            />
          </button>
        )}
        <div className="flex items-center mb-[0.938rem]">
          {post.picture ? (
            <Link
              href={`/user/${post.user_id}`}
              className="relative overflow-hidden cursor-pointer rounded-full mr-3 w-[4.688rem] h-[4.688rem]"
            >
              <Image
                src={post.picture}
                alt={post.name ? post.name : "未知使用者"}
                fill={true}
                className="object-cover"
              />
            </Link>
          ) : (
            <Link
              href={`/post/${post.id}`}
              className="cursor-pointer block w-[4.688rem] h-[4.688rem] bg-neutral-300 rounded-full mr-3 border border-solid border-inherit"
            />
          )}
          <div>
            <Link href={`/post/${post.id}`} className="text-base font-bold cursor-pointer font-outfit">
              {post.name ? post.name : "未知使用者"}
            </Link>
            <Link href={`/post/${post.id}`} className="block font-outfit font-normal text-[13px] text-[#919191]">
              {post.created_at ? relativeTime : "時間未知"}
            </Link>
          </div>
        </div>
        <article className="text-base font-medium text-black font-outfit max-w-[43.75rem]">
          {editPost ? editPostArea : postContext}
        </article>
      </div>
      <div className="flex items-center mx-[2.188rem] p-2.5 border-y border-solid border-neutral-400">
        {liked ? (
          <button type="button" onClick={deleteLikeHandler}>
            <Image src={FilledHeart} alt="filled-heart-icon" height={28} width={28} className="mr-3 cursor-pointer" />
          </button>
        ) : (
          <button type="button" onClick={createLikeHandler}>
            {theme === "dark" ? (
              <Image
                src={WhiteOutlineHeart}
                alt="outline-heart-icon"
                height={24}
                width={24}
                className="pt-1 mr-4 cursor-pointer"
              />
            ) : (
              <Image
                src={OutlineHeart}
                alt="outline-heart-icon"
                height={24}
                width={24}
                className="pt-1 mr-4 cursor-pointer"
              />
            )}
          </button>
        )}
        <Link href={`/post/${post.id}`}>
          {theme === "dark" ? (
            <Image src={WhiteCommentIcon} alt="comment-icon" height={20} width={20} className="cursor-pointer" />
          ) : (
            <Image src={CommentIcon} alt="comment-icon" height={20} width={20} className="cursor-pointer" />
          )}
        </Link>
      </div>
      <div className="flex px-[2.188rem] py-2.5 justify-between border-b border-solid border-neutral-400">
        <Link
          href={`/post/${post.id}`}
          className="cursor-pointer items-center font-sans font-normal text-base text-[#5c5c5c] dark:text-white"
        >
          {likeCount}
          人喜歡這則貼文
        </Link>
        <Link
          href={`/post/${post.id}`}
          className="cursor-pointer items-center font-sans font-normal text-base text-[#5c5c5c] dark:text-white"
        >
          {post.comment_count}則留言
        </Link>
      </div>
      <div>{CommentItems}</div>
      <div className="flex justify-center w-full py-5 mx-2">
        <Link
          href={`/post/${post.id}`}
          className="relative overflow-hidden mr-4 cursor-pointer rounded-full w-[3.25rem] h-[3.25rem]"
        >
          {userData.picture ? (
            <Image src={userData.picture} alt={userData.name || "未知使用者"} fill={true} className="object-cover" />
          ) : (
            <Image src={ProfileUser} alt="profile-user" width={52} height={52} />
          )}
        </Link>
        {showCommentArrow ? (
          <form
            onSubmit={commentSubmitHandler}
            className="relative flex items-center border border-solid rounded-[0.625rem] bg-netural-100 border-netural-100 px-2 mr-2"
          >
            <textarea
              placeholder="留個言吧"
              ref={commentRef}
              required
              onKeyDown={KeyDownCommentSubmitHandler}
              className="resize-none pl-6 py-4 md:min-w-[35rem] sm:min-w-[30rem]  min-w-[10rem] max-h-[3.375rem] pr-14 font-sans text-xl dark:text-black placeholder:text-neutral-500 font-normal leading-6 focus:outline-none bg-netural-100 no-scrollbar"
            />
            <button type="submit" className="absolute left-[31.5rem] pl-[1.125rem] md:block hidden">
              <Image src={Arrow} alt="arrow-icon" width={25} height={25} />
            </button>
          </form>
        ) : (
          <div className="cursor-pointer block w-[75%] bg-netural-100 border border-solid border-netural-100 rounded-[0.625rem] px-2 mr-2">
            <textarea
              placeholder="留個言吧"
              ref={commentRef}
              required
              onKeyDown={KeyDownCommentSubmitHandler}
              className="resize-none pl-6 py-4 w-full max-h-[3.375rem] font-sans text-xl placeholder:text-neutral-500 font-normal leading-6 focus:outline-none dark:text-black bg-netural-100 no-scrollbar"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
