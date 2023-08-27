"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Search from "@/public/images/search.png";
import ProfileDropdownList from "./ProfileDropdownList";
import NotificationPanel from "./NotificationPanel";
import SearchBar from "./SearchBar";

interface NavProps {
  userPictureChange: boolean;
  apiLoading: boolean;
}
const Nav: React.FC<NavProps> = ({ userPictureChange, apiLoading }) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const handleOutsideClick = (e: MouseEvent) => {
    const clickedElement = e.target as HTMLElement;
    if (searchBarRef.current && !searchBarRef.current.contains(clickedElement)) {
      setShowSearchBar(!showSearchBar);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });
  return (
    <div className="relative flex xl:px-[8.75rem] px-2 justify-between items-center bg-white dark:bg-[#121212] border-b border-[#D9D9D9]">
      <div className="flex items-center py-6 lg:flex">
        <Link href="/">
          <span className="block font-pattaya text-[37px] leading-9 font-normal text-[#7763FB]">CanChu</span>
        </Link>
        <div className="hidden ml-1 lg:block">
          <SearchBar />
        </div>
      </div>
      <div className="flex items-center">
        {showSearchBar && (
          <div className="absolute lg:hidden top-3 left-1 md:left-20" ref={searchBarRef}>
            <SearchBar />
          </div>
        )}
        <button
          type="button"
          className="mr-3 bg-white rounded-full lg:hidden"
          onClick={() => setShowSearchBar(!showSearchBar)}
        >
          <Image src={Search} alt="search-icon" width={17} height={17} />
        </button>
        <NotificationPanel />
        <ProfileDropdownList userPictureChange={userPictureChange} apiLoading={apiLoading} />
      </div>
    </div>
  );
};

export default Nav;
