import React, { useState } from "react";
import Top from "../components/atoms/Top";
import Feed from "../components/atoms/Feed";
import Up from "../components/atoms/Up";
import Filter from "../components/atoms/Filter";

function MainPageInd() {
  const [selectedFilter, setSelectedFilter] = useState<string[]>(["전체"]);
  return (
    <div className="flex flex-col justify-center items-center">
      <Top />
      <Filter setSelectedFilter={setSelectedFilter} />
      <Feed selectedFilter={selectedFilter} />
      <Up />
    </div>
  );
}

export default MainPageInd;
