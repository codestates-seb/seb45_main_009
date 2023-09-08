import React, { useEffect, useState } from "react";
import { FiArrowUpCircle } from "react-icons/fi";

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

  return showUpButton ? (
    <div className="fixed bottom-10 right-0 mb-10 mr-10 hover:cursor-pointer z-50">
      <FiArrowUpCircle
        size={30}
        onClick={scrollUp}
        className="sm:w-[7vw] sm:h-[7vh]"
      />
    </div>
  ) : null;
};

export default Up;
