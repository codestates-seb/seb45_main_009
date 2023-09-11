import React from "react";
import { Link, useLocation } from "react-router-dom";

const MyPageTop = () => {
  const location = useLocation();

  return (
    <nav className="flex justify-center text-xl p-2 sm:text-2xl sm:p-3 border-t-2 border-b-2 w-full">
      <Link
        to={"/mypage/feed"}
        className={`mr-6 sm:mr-8 md:mr-16 ${
          location.pathname === "/mypage/feed"
            ? "text-btn-color"
            : "hover:text-btn-color"
        }`}
      >
        피드
      </Link>
      <Link
        to={"/mypage/follow"}
        className={`mr-6 sm:mr-8 md:mr-16 ${
          location.pathname === "/mypage/follow"
            ? "text-btn-color"
            : "hover:text-btn-color"
        }`}
      >
        팔로우
      </Link>
      <Link
        to={"/mypage/edit"}
        className={` ${
          location.pathname === "/mypage/edit" ||
          location.pathname === "/mypage/changepassword"
            ? "text-btn-color"
            : "hover:text-btn-color"
        }`}
      >
        개인정보 수정
      </Link>
    </nav>
  );
};

export default MyPageTop;
