import React, { useEffect, useState } from "react";
import Filterbtn from "./Filterbtn";

const locationFilters = [
  "전체",
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "부산",
  "제주",
  "기타",
];

const exerciseFilters = [
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
  setSelectedFilter: (
    exerciseFilter: string[],
    locationFilter: string[]
  ) => void;
}

const Filter = ({ setSelectedFilter }: FilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationFilters, setShowLocationFilters] = useState(false);
  const [selectedExerciseFilters, setSelectedExerciseFilters] = useState<
    string[]
  >(["전체"]);
  const [selectedLocationFilters, setSelectedLocationFilters] = useState<
    string[]
  >(["전체"]);

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (currentPath.startsWith("/store")) {
      setShowLocationFilters(true);
    }
  }, []);

  const filterClickHandler = () => {
    setShowFilters(!showFilters);
  };

  const handleExerciseFilterButtonClick = (filter: string) => {
    let updatedExerciseFilters = [];

    if (filter === "전체") {
      updatedExerciseFilters = ["전체"];
    } else {
      updatedExerciseFilters = selectedExerciseFilters.includes("전체")
        ? selectedExerciseFilters.filter((f) => f !== "전체")
        : selectedExerciseFilters;

      // 클릭된 필터를 추가 또는 제거
      if (updatedExerciseFilters.includes(filter)) {
        updatedExerciseFilters = updatedExerciseFilters.filter(
          (f) => f !== filter
        );
      } else {
        updatedExerciseFilters = [...updatedExerciseFilters, filter];
      }
    }

    setSelectedExerciseFilters(updatedExerciseFilters);
  };

  const handleLocationFilterButtonClick = (filter: string) => {
    let updatedLocationFilters = [];

    if (filter === "전체") {
      updatedLocationFilters = ["전체"];
    } else {
      updatedLocationFilters = selectedLocationFilters.includes("전체")
        ? selectedLocationFilters.filter((f) => f !== "전체")
        : selectedLocationFilters;

      // 클릭된 필터를 추가 또는 제거
      if (updatedLocationFilters.includes(filter)) {
        updatedLocationFilters = updatedLocationFilters.filter(
          (f) => f !== filter
        );
      } else {
        updatedLocationFilters = [...updatedLocationFilters, filter];
      }
    }

    setSelectedLocationFilters(updatedLocationFilters);
  };

  useEffect(() => {
    const selectedExercises =
      selectedExerciseFilters.length === 0 ? ["전체"] : selectedExerciseFilters;
    const selectedLocations =
      selectedLocationFilters.length === 0 ? ["전체"] : selectedLocationFilters;
    setSelectedFilter(selectedLocations, selectedExercises);
  }, [selectedExerciseFilters, selectedLocationFilters]);
  // console.log(selectedLocationFilters, selectedExerciseFilters);
  return (
    <div className="max-w-6xl my-7 w-full flex items-center">
      <img
        src="/asset/filter.png"
        alt="filter"
        onClick={filterClickHandler}
        className="hover:cursor-pointer mr-5"
      />
      {showFilters && (
        <div className=" animate-slide-down">
          <div>
            {exerciseFilters.map((filter, index) => (
              <Filterbtn
                key={index}
                name={filter}
                isSelected={selectedExerciseFilters.includes(filter)}
                onClick={() => handleExerciseFilterButtonClick(filter)}
              />
            ))}
          </div>
          {showLocationFilters &&
            locationFilters.map((filter, index) => (
              <Filterbtn
                key={index}
                name={filter}
                isSelected={selectedLocationFilters.includes(filter)}
                onClick={() => handleLocationFilterButtonClick(filter)}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
