import React, { useEffect, useState } from "react";
import Filterbtn from "./Filterbtn";
import { BsFilter } from "react-icons/bs";

const locationFilters = [
  "지역전체",
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
  "해외",
];

const exerciseFilters = [
  "운동전체",
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
  setSelectedFilter: (exerciseFilter: string[]) => void;
}

const Filter = ({ setSelectedFilter }: FilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationFilters, setShowLocationFilters] = useState(false);
  const [selectedExerciseFilters, setSelectedExerciseFilters] = useState<
    string[]
  >(["운동전체"]);
  const [selectedLocationFilters, setSelectedLocationFilters] = useState<
    string[]
  >(["지역전체"]);

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

    if (filter === "운동전체") {
      updatedExerciseFilters = selectedExerciseFilters.includes("운동전체")
        ? []
        : [filter];
    } else {
      updatedExerciseFilters = selectedExerciseFilters.includes("운동전체")
        ? selectedExerciseFilters.filter((f) => f !== "운동전체")
        : selectedExerciseFilters;

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

    if (filter === "지역전체") {
      updatedLocationFilters = selectedLocationFilters.includes("지역전체")
        ? []
        : [filter];
    } else {
      updatedLocationFilters = selectedLocationFilters.includes("지역전체")
        ? selectedLocationFilters.filter((f) => f !== "지역전체")
        : selectedLocationFilters;

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

  // const handleExerciseFilterButtonClick = (filter: string) => {
  //   let updatedExerciseFilters = [];

  //   if (filter === "전체") {
  //     updatedExerciseFilters = ["전체"];
  //   } else {
  //     updatedExerciseFilters = selectedExerciseFilters.includes("전체")
  //       ? selectedExerciseFilters.filter((f) => f !== "전체")
  //       : selectedExerciseFilters;

  //     // 클릭된 필터를 추가 또는 제거
  //     if (updatedExerciseFilters.includes(filter)) {
  //       updatedExerciseFilters = updatedExerciseFilters.filter(
  //         (f) => f !== filter
  //       );
  //     } else {
  //       updatedExerciseFilters = [...updatedExerciseFilters, filter];
  //     }
  //   }

  //   setSelectedExerciseFilters(updatedExerciseFilters);
  // };

  // const handleLocationFilterButtonClick = (filter: string) => {
  //   let updatedLocationFilters = [];

  //   if (filter === "전체") {
  //     updatedLocationFilters = ["전체"];
  //   } else {
  //     updatedLocationFilters = selectedLocationFilters.includes("전체")
  //       ? selectedLocationFilters.filter((f) => f !== "전체")
  //       : selectedLocationFilters;

  //     // 클릭된 필터를 추가 또는 제거
  //     if (updatedLocationFilters.includes(filter)) {
  //       updatedLocationFilters = updatedLocationFilters.filter(
  //         (f) => f !== filter
  //       );
  //     } else {
  //       updatedLocationFilters = [...updatedLocationFilters, filter];
  //     }
  //   }

  //   setSelectedLocationFilters(updatedLocationFilters);
  // };

  useEffect(() => {
    if (selectedExerciseFilters.length === 0) {
      setSelectedExerciseFilters(["운동전체"]);
    }
    if (selectedLocationFilters.length === 0) {
      setSelectedLocationFilters(["지역전체"]);
    }

    setSelectedFilter(selectedExerciseFilters.concat(selectedLocationFilters));
  }, [selectedExerciseFilters, selectedLocationFilters]);

  return (
    <section className="max-w-6xl my-7 w-full flex items-center">
      <BsFilter
        size="40"
        onClick={filterClickHandler}
        className="hover:cursor-pointer mr-5 "
      />

      {showFilters && (
        <div className=" animate-slide-down">
          <div className="max-w-[90vw]">
            {exerciseFilters.map((filter, index) => (
              <Filterbtn
                key={index}
                name={filter}
                isSelected={selectedExerciseFilters.includes(filter)}
                onClick={() => handleExerciseFilterButtonClick(filter)}
              />
            ))}
          </div>
          <div className="max-w-[90vw]">
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
        </div>
      )}
    </section>
  );
};

export default Filter;
