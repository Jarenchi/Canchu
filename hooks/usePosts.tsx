import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

const useFetchPostsData = (userId: string | null, cursor: string | null) => {
  const router = useRouter();
  async function fetchPostsData() {
    const params: any = {};
    if (userId) {
      params.user_id = userId;
    }
    if (cursor) {
      params.cursor = cursor;
    }
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/search`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        params,
      });
      console.log(response);
      console.log(response.data.data.next_cursor);
      return [response.data.data.posts, response.data.data.next_cursor];
    } catch (error: any) {
      if (error.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("無法取得貼文", `${error}`, "error");
      }
      return null;
    }
  }
  return fetchPostsData;
};
export default useFetchPostsData;
