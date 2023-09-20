import React from "react";
import { Link, useLocation } from "react-router-dom";

const Top = () => {
  //oauthloading에서 제외
  const location = useLocation();
  if (location.pathname === "/oauthloading") {
    return null;
  }
  return (
    <nav className="flex justify-center text-xl p-2 sm:text-2xl sm:p-2 border-t-2 border-b-2 w-full font-semibold z-0">
      <Link
        to={"/"}
        className={`mr-6 sm:mr-8 md:mr-16 ${
          location.pathname === "/" ? "opacity-100" : "opacity-40 hover:opacity-100"
        }`}
      >
        <span>유저</span>
      </Link>
      <Link
        to={"/store"}
        className={`mr-6 sm:mr-8 md:mr-16 ${
          location.pathname === "/store" ? "opacity-100" : "opacity-40 hover:opacity-100"
        }`}
      >
        센터
      </Link>
      {/* <Link
        to={"/community"}
        className={` ${location.pathname === "/community" ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
      >
        커뮤니티
      </Link> */}
    </nav>
  );
};

export default Top;
