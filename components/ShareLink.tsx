import React, { useRef } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import swal from "sweetalert";
import CloseButton from "@/public/images/close-button.png";
import Modal from "./layout/Modal";

interface ShareLinkProps {
  modalToggleHandler: Function;
}
const ShareLink: React.FC<ShareLinkProps> = ({ modalToggleHandler }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUrl = window.location.href;
  const copyLink = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current?.value);
    }
    swal("已複製到剪貼簿", "分享給其他朋友", "success");
  };
  return (
    <Modal>
      <div className="flex flex-col items-center">
        <p className="pt-6 pb-4 text-2xl text-center text-black font-outfit">分享個人連結</p>
        <button type="button" onClick={() => modalToggleHandler()} className="absolute top-6 right-6">
          <Image src={CloseButton} alt="close-button" />
        </button>
        <div className="flex flex-col items-center mx-2 mb-4">
          <QRCodeSVG value={currentUrl} size={250} />
          <div className="flex items-center mt-6">
            <input className="py-1 mr-2 w-[16rem] border rounded-lg" defaultValue={currentUrl} ref={inputRef} />
            <button type="button" onClick={copyLink} className="px-2 py-1 border rounded-lg dark:text-black">
              複製
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ShareLink;
