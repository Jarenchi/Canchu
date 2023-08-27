import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import nookies from "nookies";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import Search from "@/public/images/search.png";
import ProfileUser from "@/public/images/profile-user.png";

interface UserSearchItem {
  id: number;
  name: string;
  picture: string | null;
  friendship?: {
    id: number;
    status: string | null;
  };
}

const SearchBar: React.FC = () => {
  const router = useRouter();
  const [showSearchResults, setShowSearchResults] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [userSearchData, setUserSearchData] = useState<Array<UserSearchItem>>([]);
  const debounceSearch = useDebounce();
  const handleInputClick = () => {
    setShowSearchResults(true);
  };
  const handleOutsideClick = (e: MouseEvent) => {
    const clickedElement = e.target as HTMLElement;
    if (searchInputRef.current && !searchInputRef.current.contains(clickedElement)) {
      setShowSearchResults(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });
  async function getSearchData() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/search`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        params: { keyword: searchInputRef.current?.value },
      });
      setUserSearchData(response.data.data.users);
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
    }
  }
  const handleInputChange = () => {
    debounceSearch(getSearchData, 500);
  };
  const userSearchItems = userSearchData?.map((userSearchItem: UserSearchItem, index: number) => (
    <button
      type="button"
      key={userSearchItem.id}
      onClick={() => router.push(`/user/${userSearchItem.id}`)}
      className={`flex items-center py-3 md:pl-9 pl-2 md:min-w-[20.625rem] min-w-[14rem] dark:bg-neutral-600 ${
        index !== userSearchData.length - 1 && "border-b-[1px] border-[#D9D9D9]"
      }`}
    >
      <div className="relative w-10 h-10 mr-4 overflow-hidden rounded-full cursor-pointer">
        <Image
          src={userSearchItem.picture || ProfileUser}
          alt={userSearchItem.name}
          fill={true}
          className="object-cover"
        />
      </div>
      <p className="text-base font-outift text-[#566470] dark:text-white font-medium">{userSearchItem.name}</p>
    </button>
  ));
  return (
    <label htmlFor="searchInput" className="relative sm:ml-[1.438rem] sm:mt-0 mt-4">
      <span className="sr-only">Search</span>
      <span className="absolute flex items-center inset-y-0 left-0 pl-[1rem]">
        <Image src={Search} alt="search-icon" width={17} height={17} />
      </span>
      <input
        className="bg-[#F0F2F5] rounded-[0.625rem] pl-11 lg:min-w-[20.625rem] min-w-[10rem] dark:text-black md:pr-4 pr-2 py-3 placeholder:font-outfit placeholder:font-medium placeholder:text-[15px] placeholder:leading-6 placeholder:text-[#566470] focus:outline-none"
        placeholder="搜尋"
        type="text"
        name="search"
        ref={searchInputRef}
        onChange={handleInputChange}
        onClick={handleInputClick}
      />
      {searchInputRef.current?.value && showSearchResults && (
        <div className="rounded-[20px] bg-white absolute top-14 z-10 border max-h-[18.75rem] overflow-auto">
          {userSearchItems}
        </div>
      )}
    </label>
  );
};

export default SearchBar;
