import React, { useState } from "react";
import Filterbtn from "./Filterbtn";

const filters = [
  "전체",
  "헬스",
  "크로스핏",
  "필라테스",
  "요가",
  "러닝",
  "수영",
  "홈트",
  "등산",
  "축구",
  "농구",
  "기타",
];

const Filter = () => {
  const [showFilters, setShowFilters] = useState(false);

  const filterClickHandler = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="max-w-5xl my-7 w-full">
      <img
        src="/asset/filter.png"
        alt="filter"
        onClick={filterClickHandler}
        className="hover:cursor-pointer"
      />
      {showFilters && (
        <div className="m-2 animate-slide-down">
          {filters.map((filter, index) => (
            <Filterbtn key={index} name={filter} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
