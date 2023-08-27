import { useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";

const useUser = (id: string) => {
  const router = useRouter();
  async function fetchUserData() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/profile`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      console.log(response);
      return response.data.data.user;
    } catch (error: any) {
      if (error?.response?.status === 403) {
        swal("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("無法取得使用者資料", `${error}`, "error");
      }
      return null;
    }
  }
  return fetchUserData;
};

export default useUser;
