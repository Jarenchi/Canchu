"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import swal from "sweetalert";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useUserData from "@/hooks/useUserData";
import ProfileUser from "@/public/images/profile-user.png";
import EditAvatar from "./EditAvatar";
import ShareLink from "./ShareLink";

interface ProfileBannerProps {
  setUserPictureChange: React.Dispatch<React.SetStateAction<boolean>>;
  isAbleToEdit: boolean;
  apiLoading: boolean;
}
const ProfileBanner: React.FC<ProfileBannerProps> = ({ setUserPictureChange, isAbleToEdit, apiLoading }) => {
  const { userData } = useUserData();
  const [showEditPicture, setShowEditPicture] = useState<boolean>(false);
  const [showLink, setShowLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | File>("");
  const EditAvatarModalToggleHandler = () => {
    setShowEditPicture((prev) => !prev);
    document.body.classList.toggle("modal-open");
  };
  const ShareLinkModalToggleHandler = () => {
    setShowLink((prev) => !prev);
    document.body.classList.toggle("modal-open");
  };
  async function fileChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (!files || files.length === 0) {
      swal("未選擇檔案", "請選擇一張圖片", "error");
      return;
    }
    const file = files[0];
    const acceptedFileTypes = /image\/(png|jpeg|jpg)/;
    if (!acceptedFileTypes.test(file.type)) {
      swal("請重新選擇圖片", "只接受 .png, .jpg 或 .jpeg 格式的文件", "error");
      return;
    }
    const maxFileSize = 1048576; // 1MB in bytes
    if (file.size > maxFileSize) {
      swal("圖片太大了", "檔案大小不能超過1MB", "error");
      return;
    }
    setSelectedFile(file);
    EditAvatarModalToggleHandler();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }
  return (
    <div className="xl:px-[8.5rem] px-3 w-full pt-[2.813rem] bg-white dark:bg-black">
      <div className="flex shrink-0 items-center pb-[4.125rem] border-b">
        {apiLoading ? (
          <Skeleton circle width="11.25rem" height="11.25rem" />
        ) : (
          <div className="relative overflow-hidden cursor-pointer rounded-full md:w-[11.25rem] md:h-[11.25rem] w-24 h-24 group">
            <Image
              src={userData.picture || ProfileUser}
              alt={userData.name || "未知使用者"}
              fill={true}
              className={`object-cover ${isAbleToEdit && "group-hover:brightness-50"}`}
            />
            {isAbleToEdit && (
              <label htmlFor="uploadAvatar" className="hidden group-hover:block">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute text-lg border-b font-bold leading-6 text-white md:top-[45%] top-8 md:left-1/4 "
                >
                  編輯大頭貼
                  <input
                    type="file"
                    id="uploadAvatar"
                    ref={fileInputRef}
                    onChange={fileChangeHandler}
                    className="hidden"
                  />
                </button>
              </label>
            )}
          </div>
        )}
        <div className="ml-4 lg:ml-11">
          {apiLoading ? (
            <Skeleton width="4rem" height="2rem" />
          ) : (
            <p className="pb-5 font-outfit font-bold lg:text-[40px] md:text-[25px] text-[20px] leading-6">
              {userData.name || "未知使用者"}
            </p>
          )}
          {userData.friend_count !== 0 ? <span>{userData.friend_count}位朋友</span> : <span>沒有朋友</span>}
        </div>
        {showEditPicture && (
          <EditAvatar
            setUserPictureChange={setUserPictureChange}
            modalToggleHandler={EditAvatarModalToggleHandler}
            file={selectedFile}
          />
        )}
      </div>
      <div>
        <button
          type="button"
          className="mr-3 text-xl font-bold leading-6 border-b-4 px-7 py-7 font-outfit text-berry-blue border-berry-blue"
        >
          貼文
        </button>
        <button
          type="button"
          onClick={ShareLinkModalToggleHandler}
          className="text-xl font-bold leading-6 border-b-4 px-7 py-7 font-outfit text-berry-blue border-berry-blue"
        >
          個人連結
        </button>
        {showLink && <ShareLink modalToggleHandler={ShareLinkModalToggleHandler} />}
      </div>
    </div>
  );
};

export default ProfileBanner;
