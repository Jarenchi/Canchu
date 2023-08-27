"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";

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
const usePost = (
  id: string,
  postChange: boolean,
  commentChange: boolean,
  setCommentChange: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const router = useRouter();
  const [postData, setPostData] = useState<PostData | undefined>();
  useEffect(() => {
    setCommentChange(false);
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        });
        console.log(response);
        setPostData(response.data.data.post);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          swal("帳號已過期", "請重新登入", "error");
          router.push("/login");
        }
        if (error?.response?.status >= 500 && error?.response?.status < 600) {
          swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
        } else {
          swal("無法取得貼文", `${error}`, "error");
        }
      }
    };
    fetchPostData();
  }, [id, postChange, commentChange, router, setCommentChange]);
  return postData;
};

export default usePost;
