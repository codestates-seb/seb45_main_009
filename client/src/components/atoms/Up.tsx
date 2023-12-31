import React, { useEffect, useState } from "react";
import { FiArrowUpCircle } from "react-icons/fi";
import { useLocation } from "react-router";
const Up = () => {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [showUpButton, setShowUpButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowUpButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
  return showUpButton ? (
    <div className="fixed opacity-80 bottom-10 right-10 mb-10 hover:cursor-pointer z-50 max-mobile:bottom-5 max-mobile:right-5">
      <FiArrowUpCircle size={30} onClick={scrollUp} className="sm:w-[7vw] sm:h-[7vh]" />
    </div>
  ) : null;
};

export default Up;
