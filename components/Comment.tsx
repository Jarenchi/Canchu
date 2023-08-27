import React from "react";
import Image from "next/image";
import Link from "next/link";
import useRelativeTime from "@/hooks/useRelativeTime";

interface CommentProps {
  comment: {
    id: number;
    content: string;
    created_at: string;
    user: {
      id: number;
      name: string;
      picture: string;
    };
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  const relativeTime = useRelativeTime(comment.created_at);
  return (
    <div key={comment.id} className="flex pl-[1.625rem] py-4">
      {comment.user.picture ? (
        <div className="relative w-8 h-8 overflow-hidden rounded-full cursor-pointer">
          <Link href={`/user/${comment.user.id}`}>
            <Image src={comment.user.picture} alt={comment.user.name} fill={true} className="object-cover" />
          </Link>
        </div>
      ) : (
        <div className="rounded-full w-8 h-8 bg-[#D9D9D9] pl-[1.625rem] pt-[1.625rem]" />
      )}
      <div className="ml-2.5">
        <div className="bg-[#D9D9D952] rounded-[1.25rem] pt-2 pl-4 pr-3">
          <span className="font-sans text-base font-semibold">{comment.user.name}</span>
          <pre className="font-sans text-base pb-[0.9rem] break-words whitespace-pre-wrap">{comment.content}</pre>
        </div>
        <p className="font-sans font-normal pt-[0.3rem] text-[14px] leading-6 text-grey dark:text-white">
          {comment.created_at ? relativeTime : "時間未知"}
        </p>
      </div>
    </div>
  );
};

export default Comment;
