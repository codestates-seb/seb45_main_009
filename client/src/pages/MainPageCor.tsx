import React from "react";
import styled from "styled-components";
import Top from "../components/atoms/Top";
import Feed from "../components/atoms/Feed";
import Up from "../components/atoms/Up";
import Filter from "../components/atoms/Filter";

function MainPageCor() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Top />
      <Filter />
      <Feed />
      <Up />
    </div>
  );
}

export default MainPageCor;
