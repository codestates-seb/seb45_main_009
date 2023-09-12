import React, { useState } from "react";
import Feed from "../components/atoms/Feed";
import Filter from "../components/atoms/Filter";

function MainPageInd() {
  const [selectedFilter, setSelectedFilter] = useState<string[]>(["전체"]);
  return (
    <div className="flex flex-col justify-center items-center">
      <Filter setSelectedFilter={setSelectedFilter} />
      <Feed selectedFilter={selectedFilter} />
    </div>
  );
}

export default MainPageInd;
