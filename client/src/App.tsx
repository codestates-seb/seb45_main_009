import React from "react";
import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";

import MainPageInd from "./pages/MainPageInd";
import MainPageCor from "./pages/MainPageCor";
import FeedDetailPageCor from "./pages/FeedDetailPageCor";
import FeedDetailPageInd from "./pages/FeedDetailPageInd";
import FeedFormPageCor from "./pages/FeedFormPageCor";
import FeedFormPageInd from "./pages/FeedFormPageInd";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MainPageInd />}></Route>
          <Route path="/store" element={<MainPageCor />}></Route>
          <Route path="/feeddetailcor" element={<FeedDetailPageCor />}></Route>
          <Route path="/feeddetailind" element={<FeedDetailPageInd />}></Route>
          <Route path="/feedformcor" element={<FeedFormPageCor />}></Route>
          <Route path="/feedformind" element={<FeedFormPageInd />}></Route>
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
