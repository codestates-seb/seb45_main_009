import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";

import MainPageInd from "./pages/MainPageInd";
// import MainPageCor from "./pages/MainPageCor";
import FeedDetailPageCor from "./pages/FeedDetailPageCor";
import FeedDetailPageInd from "./pages/FeedDetailPageInd";
import FeedFormPageCor from "./pages/FeedFormPageCor";
import FeedFormPageInd from "./pages/FeedFormPageInd";
import Not404 from "./pages/Not404";
import MainPageCor from "./pages/MainPageCor";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<MainPageInd />} />
          <Route path="/store" element={<MainPageCor />} />
          <Route path="/feeddetailcor" element={<FeedDetailPageCor />} />
          <Route path="/feeddetailind" element={<FeedDetailPageInd />} />
          <Route path="/feedformcor" element={<FeedFormPageCor />} />
          <Route path="/feedformind" element={<FeedFormPageInd />} />
          <Route path="*" element={<Not404 />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
