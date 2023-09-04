import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import nookies, { destroyCookie } from "nookies";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import useUser from "@/hooks/useFetchUser";
import "react-loading-skeleton/dist/skeleton.css";
import ProfileUser from "@/public/images/profile-user.png";
import UserIcon from "@/public/images/user-icon.png";
import ThemeSwitch from "./ThemeSwitch";

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
const DropdownList = styled.div`
  .clickarea {
    position: absolute;
    width: 350px;
    height: 350px;
    top: 0;
    right: 0;
    display: none;
  }
  &:hover > .clickarea {
    display: block;
  }
`;
interface ProfileDropdownListProps {
  userPictureChange: boolean;
  apiLoading: boolean;
}

const ProfileDropdownList: React.FC<ProfileDropdownListProps> = ({ userPictureChange, apiLoading }) => {
  const router = useRouter();
  const fetchUserData = useUser(nookies.get().user_id);
  const [userData, setUserData] = useState<UserData>();
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
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
  }, [userPictureChange]);
  const logoutHandler = () => {
    destroyCookie(null, "access_token");
    destroyCookie(null, "user_id");
    destroyCookie(null, "user_name");
    destroyCookie(null, "user_email");
    router.push("/login");
  };
  return (
    <DropdownList className="relative z-10 cursor-pointer">
      {apiLoading ? (
        <Skeleton circle width="2.375rem" height="2.375rem" />
      ) : (
        <>
          {userData?.picture ? (
            <Link href={`/user/${nookies.get().user_id}`}>
              <div className="relative overflow-hidden cursor-pointer rounded-full w-[2.375rem] h-[2.375rem]">
                <Image
                  src={userData.picture}
                  alt={userData.name || "未知使用者"}
                  fill={true}
                  className="object-cover"
                />
              </div>
            </Link>
          ) : (
            <Image src={ProfileUser} alt={userData?.name || "未知使用者"} width={38} height={38} />
          )}
        </>
      )}
      <div className="clickarea">
        <div className="relative top-20">
          <div className="flex items-center justify-between bg-berry-blue px-[1.125rem] py-[0.813rem] rounded-t-[1.3rem] ">
            <div className="flex items-center">
              <Image src={UserIcon} alt="profile-user" width={38} height={38} />
              <span className="font-outfit font-bold break-words whitespace-pre-wrap text-white ml-[1rem] text-[1.3rem] leading-6">
                {userData?.name || "你的名字"}
              </span>
            </div>
            <ThemeSwitch />
          </div>
          <div className="px-[23px] bg-[#F6F6F6] rounded-b-[1.3rem] dark:bg-neutral-600">
            <div className="border-b py-[1.3rem]">
              <Link href={`/user/${nookies.get().user_id}`} className="font-outfit font-medium text-[22px] leading-6">
                查看個人檔案
              </Link>
            </div>
            <button
              type="button"
              className="py-[1.3rem] font-outfit font-medium text-[22px] leading-6"
              onClick={logoutHandler}
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </DropdownList>
  );
};

export default ProfileDropdownList;
