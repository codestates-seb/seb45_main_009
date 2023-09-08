import React from "react";
import { FiArrowUpCircle } from "react-icons/fi";

const Up = () => {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // window.scrollY 값이 200 이상일 때 버튼을 표시
  const showUpButton = window.scrollY > 400;

  return (
    // showUpButton 값에 따라 버튼을 조건부로 렌더링
    showUpButton ? (
      <div className="fixed bottom-10 right-0 mb-10 mr-10 hover:cursor-pointer z-50">
        <FiArrowUpCircle
          size={30}
          onClick={scrollUp}
          className="sm:w-[7vw] sm:h-[7vh]"
        />
      </div>
    ) : null
  );
};

export default Up;
