import React from "react";
import { Link, useLocation } from "react-router-dom";

const Top = () => {
  //oauthloading에서 제외
  const location = useLocation();
  if (location.pathname === "/oauthloading") {
    return null;
  }
  return (
    <nav className="flex justify-center text-xl p-2 sm:text-2xl sm:p-3 border-t-2 border-b-2 w-full">
      <Link
        to={"/"}
        className={`mr-6 sm:mr-8 md:mr-16 ${location.pathname === "/" ? "text-btn-color" : "hover:text-btn-color"}`}
      >
        개인
      </Link>
      <Link
        to={"/store"}
        className={`mr-6 sm:mr-8 md:mr-16 ${
          location.pathname === "/store" ? "text-btn-color" : "hover:text-btn-color"
        }`}
      >
        업체 정보
      </Link>
      <Link
        to={"/community"}
        className={` ${location.pathname === "/community" ? "text-btn-color" : "hover:text-btn-color"}`}
      >
        커뮤니티
      </Link>
    </nav>
  );
};

export default Top;
