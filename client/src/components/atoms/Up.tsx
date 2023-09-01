import React from "react";

const Up = () => {
  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 right-0 mb-10 mr-10 hover:cursor-pointer">
      <img src="/asset/up.png" alt="pageup" onClick={scrollUp} />
    </div>
  );
};

export default Up;
