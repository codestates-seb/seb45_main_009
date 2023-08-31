import React, { useState } from "react";

interface FilterbtnProps {
  name: string;
}
//7FBCD9
const Filterbtn = ({ name }: FilterbtnProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <button
      className={`mr-5 mb-2 border rounded-lg px-3 py-1 ${
        isClicked ? "bg-btn-color" : ""
      }`}
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default Filterbtn;
