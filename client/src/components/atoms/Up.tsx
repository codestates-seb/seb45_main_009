import React from "react";

const Up = () => {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-end mr-10 hover:cursor-pointer w-full">
      <img src="/asset/up.png" alt="pageup" onClick={scrollUp}></img>
    </div>
  );
};

export default Up;
