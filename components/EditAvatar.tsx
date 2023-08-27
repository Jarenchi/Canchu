import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import nookies from "nookies";
import AvatarEditor from "react-avatar-editor";
import swal from "sweetalert";
import CloseButton from "@/public/images/close-button.png";
import Modal from "./layout/Modal";

interface EditAvatarProps {
  setUserPictureChange: React.Dispatch<React.SetStateAction<boolean>>;
  file: string | File;
  modalToggleHandler: Function;
}

const EditAvatar: React.FC<EditAvatarProps> = ({ setUserPictureChange, file, modalToggleHandler }) => {
  const router = useRouter();
  const handleEditorRef = useRef<AvatarEditor>(null);
  async function PictureSubmitHandler() {
    if (handleEditorRef.current) {
      const edittedCanvas = handleEditorRef.current.getImageScaledToCanvas();
      const blob = await new Promise<Blob | null>((resolve) => {
        edittedCanvas.toBlob((canvasBlob) => resolve(canvasBlob), "image/png");
      });
      if (blob) {
        const editedFile = new File([blob], "edited_avatar.png", {
          type: "image/png",
          lastModified: Date.now(),
        });
        const formData = new FormData();
        formData.append("picture", editedFile);
        try {
          const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/picture`, formData, {
            headers: { Authorization: `Bearer ${nookies.get().access_token}` },
          });
          console.log(response);
          setUserPictureChange(true);
          swal("圖片上傳成功", "全新的圖片讚喔!", "success");
        } catch (error: any) {
          if (error?.response?.status === 403) {
            swal("帳號已過期", "請重新登入", "error");
            router.push("/login");
          }
          if (error?.response?.status >= 500 && error?.response?.status < 600) {
            swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
          } else {
            swal("圖片上傳失敗", `${error}`, "error");
          }
        }
      }
      modalToggleHandler();
    }
  }
  return (
    <Modal>
      <div className="flex flex-col items-center">
        <p className="pt-6 pb-4 text-2xl text-center text-black font-outfit">編輯頭像</p>
        <button type="button" onClick={() => modalToggleHandler()} className="absolute top-6 right-6">
          <Image src={CloseButton} alt="close-button" />
        </button>
        <div className="flex flex-col items-center">
          <AvatarEditor
            ref={handleEditorRef}
            image={file}
            width={250}
            height={250}
            border={50}
            borderRadius={150}
            color={[0, 0, 0, 0.5]}
            scale={1}
            rotate={0}
          />
          <button
            type="submit"
            onClick={PictureSubmitHandler}
            className="my-5 py-2.5 px-14 bg-berry-blue text-white rounded-md"
          >
            上傳
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditAvatar;
