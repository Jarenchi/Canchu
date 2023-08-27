import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";

interface Friend {
  id: number;
  name: string;
  picture: string | null;
  friendship?: {
    id: number;
    status: string | null;
  };
}
const useFetchFriendsRequestsData = (
  friendRequestChange: boolean,
  setFriendRequestChange: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const router = useRouter();
  const [friendRequestData, setFriendRequestData] = useState<Array<Friend>>([]);
  useEffect(() => {
    const getFriendsRequestsData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/pending`, {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        });
        console.log(response);
        setFriendRequestData(response.data.data.users);
      } catch (error: any) {
        if (error?.response?.status === 403) {
          swal("帳號已過期", "請重新登入", "error");
          router.push("/login");
        }
        if (error?.response?.status >= 500 && error?.response?.status < 600) {
          swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
        } else {
          swal("無法取得好友邀請", `${error}`, "error");
        }
      }
    };
    getFriendsRequestsData();
    setFriendRequestChange(false);
  }, [friendRequestChange, setFriendRequestChange, router]);

  return friendRequestData;
};

export default useFetchFriendsRequestsData;
