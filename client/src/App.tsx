import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Alarm from './pages/Alarm'


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
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/alarm" element={<Alarm />}></Route>
          <Route path="/" element={<MainPageInd />}></Route>
          <Route path="/store" element={<MainPageCor />}></Route>
          <Route path="/feeddetailcor" element={<FeedDetailPageCor />}></Route>
          <Route path="/feeddetailind" element={<FeedDetailPageInd />}></Route>
          <Route path="/feedformcor" element={<FeedFormPageCor />}></Route>
          <Route path="/feedformind" element={<FeedFormPageInd />}></Route>
          <Route path="*" element={<Not404 />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
