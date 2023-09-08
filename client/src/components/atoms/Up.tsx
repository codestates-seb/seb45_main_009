import React from "react";
import { FiArrowUpCircle } from "react-icons/fi";
import { useLocation } from "react-router";
const Up = () => {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  //oauthloading에서 제외
  const location = useLocation();
  if (
    location.pathname === "/oauthloading" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/feedformind"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-10 right-0 mb-10 mr-10 hover:cursor-pointer z-50">
      <FiArrowUpCircle size={30} onClick={scrollUp} className=" sm:w-[7vw] sm:h-[7vh]" />
    </div>
  );
};

export default Up;
