import { create } from "zustand";

interface UserData {
  id: number;
  name: string;
  picture: string;
  friend_count: number;
  introduction: string;
  tags: string;
  friendship?: {
    id: number;
    status: string;
  };
}
interface UseUserData {
  userData: UserData;
  setUserData: (newData: UserData) => void;
}
const useUserData = create<UseUserData>((set) => ({
  userData: {
    id: 0,
    name: "",
    picture: "",
    friend_count: 0,
    introduction: "",
    tags: "",
  },
  setUserData: (newData: UserData) => set({ userData: newData }),
}));

export default useUserData;
