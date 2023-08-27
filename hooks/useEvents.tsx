import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";

const useEvents = () => {
  const getEvents = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events/`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      console.log(response.data.data.events);
      return response.data.data.events;
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("訊息載入錯誤", `${error}`, "error");
      }
      return null;
    }
  };
  return getEvents();
};

export default useEvents;
