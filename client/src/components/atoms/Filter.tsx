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
interface FilterProps {
  setSelectedFilter: (filter: string) => void;
}

const Filter = ({ setSelectedFilter }: FilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterClickHandler = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterButtonClick = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
    setSelectedFilter(filter);
  };

  return (
    <div className="max-w-7xl my-7 w-full">
      <img
        src="/asset/filter.png"
        alt="filter"
        onClick={filterClickHandler}
        className="hover:cursor-pointer"
      />
      {showFilters && (
        <div className="m-2 animate-slide-down">
          {filters.map((filter, index) => (
            <Filterbtn
              key={index}
              name={filter}
              isSelected={selectedFilters.includes(filter)}
              onClick={() => handleFilterButtonClick(filter)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
