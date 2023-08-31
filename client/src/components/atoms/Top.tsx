import React from "react";
import { Link, useLocation } from "react-router-dom";

const Top = () => {
  const location = useLocation();

  return (
    <div className="flex justify-center text-2xl p-3 border-t-2 border-b-2 w-full">
      <Link
        to={"/"}
        className={`mr-10 ${
          location.pathname === "/" ? "text-btn-color" : "hover:text-btn-color"
        }`}
      >
        개인
      </Link>
      <Link
        to={"/store"}
        className={`mr-10 ${
          location.pathname === "/store"
            ? "text-btn-color"
            : "hover:text-btn-color"
        }`}
      >
        업체 정보
      </Link>
      <Link
        to={"/community"}
        className={`mr-10 ${
          location.pathname === "/community"
            ? "text-btn-color"
            : "hover:text-btn-color"
        }`}
      >
        커뮤니티
      </Link>
    </div>
  );
};

export default Top;
