"use client";

import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import swal from "sweetalert";
import { useRouter } from "next/navigation";
import nookies from "nookies";

const Page: React.FC = () => {
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const signupNameRef = useRef<HTMLInputElement>(null);
  const signupEmailRef = useRef<HTMLInputElement>(null);
  const signupPasswordRef = useRef<HTMLInputElement>(null);
  const signupConfirmPasswordRef = useRef<HTMLInputElement>(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRefs = [
    loginEmailRef,
    loginPasswordRef,
    signupNameRef,
    signupEmailRef,
    signupPasswordRef,
    signupConfirmPasswordRef,
  ];
  useEffect(() => {
    // Add reCaptcha
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    document.body.appendChild(script);
  }, []);
  function clearInputRefs() {
    inputRefs.forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
  }
  const ShowLoginHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setShowLogin(!showLogin);
    clearInputRefs();
  };
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  async function verifyRecaptcha(action: string): Promise<boolean> {
    const token = await window.grecaptcha.execute(`${recaptchaSiteKey}`, {
      action,
    });
    const response = await axios.post("/api/recaptcha", {
      params: {
        response: token,
      },
    });
    console.log(response.data);
    return response.data > 0.5;
  }
  async function loginHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const loginEmail = loginEmailRef.current?.value.trim();
      const loginPassword = loginPasswordRef.current?.value.trim();
      const isValid = await verifyRecaptcha("login");
      if (isValid) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/signin`, {
          provider: "native",
          email: loginEmail,
          password: loginPassword,
        });
        const userData = response.data.data;
        const maxAge = { maxAge: 3600 }; // 1hr
        nookies.set(null, "access_token", userData.access_token, maxAge);
        nookies.set(null, "user_id", userData.user.id.toString(), maxAge);
        nookies.set(null, "user_name", userData.user.name, maxAge);
        nookies.set(null, "user_email", userData.user.email, maxAge);
        router.push("/");
      } else {
        swal("登入失敗", "你好像是機器人", "error");
        setLoading(false);
        return;
      }
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("登入失敗", `${error}`, "error");
      }
    }
    clearInputRefs();
    setLoading(false);
  }
  async function signupHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (signupPasswordRef.current?.value !== signupConfirmPasswordRef.current?.value) {
      swal("密碼不相符", "請輸入相同的密碼", "error");
      setLoading(false);
      return;
    }
    const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const password = signupPasswordRef.current?.value;
    if (password && !passwordRule.test(password)) {
      swal("請重新輸入密碼", "密碼須包含1個大寫和1個小寫字母和數字，且長度必須超過8", "error");
      setLoading(false);
      return;
    }
    try {
      const signupName = signupNameRef.current?.value.trim();
      const signupemail = signupEmailRef.current?.value.trim();
      const signupPassword = signupPasswordRef.current?.value.trim();
      const isValid = await verifyRecaptcha("signup");
      if (isValid) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/signup`, {
          name: signupName,
          email: signupemail,
          password: signupPassword,
        });
        console.log(response);
        swal("註冊成功", "歡迎使用CanChu", "success");
      } else {
        swal("註冊失敗", "你好像是機器人", "error");
        setLoading(false);
        return;
      }
    } catch (error: any) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        swal("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        swal("註冊失敗", `${error}`, "error");
      }
    }
    clearInputRefs();
    setLoading(false);
    setShowLogin(!showLogin);
  }
  return (
    <div className="flex md:pb-24 md:mt-10">
      <div className="max-w-[53rem] mx-auto">
        <div className="flex dark:border dark:border-white md:rounded-[20px]">
          <div className="flex flex-col items-center justify-center md:border dark:border-0 md:rounded-l-[20px] md:px-[7.5rem]">
            <p className="mb-6 text-6xl font-pattaya text-[#7763FB] font-normal mt-16">CanChu</p>
            {showLogin ? (
              <p className="mb-10 text-4xl text-black dark:text-white font-outfit">會員登入</p>
            ) : (
              <p className="mb-6 text-4xl text-black dark:text-white font-outfit">會員註冊</p>
            )}
            {showLogin ? (
              <form method="post" className="flex flex-col items-center" onSubmit={loginHandler}>
                <label htmlFor="email" className="block mb-6">
                  <p className="mb-2.5 font-outfit text-base font-medium text-black dark:text-white">電子郵件</p>
                  <input
                    ref={loginEmailRef}
                    type="email"
                    id="email"
                    required
                    className="border border-berry-blue rounded-md focus:outline-none py-2 px-3.5 min-w-[19.25rem] placeholder:font-outfit placeholder:font-medium placeholder:text-base"
                    placeholder="例: shirney@appworks.tw"
                  />
                </label>
                <label htmlFor="password" className="block mb-6">
                  <p className="mb-2.5 font-outfit text-base font-medium text-black dark:text-white">密碼</p>
                  <input
                    ref={loginPasswordRef}
                    type="password"
                    required
                    className="border border-berry-blue rounded-md focus:outline-none py-2 px-3.5 min-w-[19.25rem]"
                  />
                </label>
                <div className="flex flex-col items-center">
                  <button
                    disabled={loading}
                    type="submit"
                    className="rounded-md py-2.5 px-12 bg-berry-blue text-white font-outfit font-normal text-base cursor-pointer disabled:opacity-50"
                  >
                    登入
                  </button>
                  <p className="text-base font-medium font-outfit mt-2.5">
                    尚未成為會員 ?
                    <button type="button" className="text-berry-blue" onClick={ShowLoginHandler}>
                      會員註冊
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              <form className="flex flex-col items-center pb-11" onSubmit={signupHandler}>
                <label htmlFor="email" className="block mb-6">
                  <p className="mb-2.5 font-outfit text-base font-medium text-black dark:text-white">使用者名稱</p>
                  <input
                    ref={signupNameRef}
                    type="text"
                    id="user"
                    required
                    className="border border-berry-blue rounded-md focus:outline-none py-2 px-3.5 min-w-[19.25rem] placeholder:font-outfit placeholder:font-medium placeholder:text-base"
                    placeholder="例: Chou Chou Hu"
                  />
                </label>
                <label htmlFor="email" className="block mb-6">
                  <p className="mb-2.5 font-outfit text-base font-medium text-black dark:text-white">電子郵件</p>
                  <input
                    ref={signupEmailRef}
                    type="email"
                    id="email"
                    required
                    className="border border-berry-blue rounded-md focus:outline-none py-2 px-3.5 min-w-[19.25rem] placeholder:font-outfit placeholder:font-medium placeholder:text-base"
                    placeholder="例: shirney@appworks.tw"
                  />
                </label>
                <label htmlFor="password" className="block mb-6">
                  <p className="mb-2.5 font-outfit text-base font-medium text-black dark:text-white">密碼</p>
                  <input
                    ref={signupPasswordRef}
                    required
                    type="password"
                    className="border border-berry-blue rounded-md focus:outline-none py-2 px-3.5 min-w-[19.25rem]"
                  />
                </label>
                <label htmlFor="confirmPassword" className="block mb-6">
                  <p className="mb-2.5 font-outfit text-base font-medium text-black dark:text-white">再次輸入密碼</p>
                  <input
                    ref={signupConfirmPasswordRef}
                    required
                    type="password"
                    className="border border-berry-blue rounded-md focus:outline-none py-2 px-3.5 min-w-[19.25rem]"
                  />
                </label>
                <div className="flex flex-col items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md py-2.5 px-12 bg-berry-blue text-white font-outfit font-normal text-base cursor-pointer disabled:opacity-50"
                  >
                    註冊
                  </button>
                  <p className="text-base font-medium font-outfit mt-2.5">
                    已經是會員了 ?
                    <button type="button" className="text-berry-blue" onClick={ShowLoginHandler}>
                      會員登入
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
          <div className="bg-berry-blue hidden rounded-r-[20px] min-w-[18.65rem] min-h-[38.75rem] md:block" />
        </div>
        <p className="hidden mt-4 font-normal text-right cursor-pointer text-grey dark:text-white md:block">
          關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
        </p>
      </div>
    </div>
  );
};
export default Page;
