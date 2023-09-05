import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { login } from "./redux/reducers/loginSlice";

import { UserInfo } from "./types/types";

import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import MainPageInd from "./pages/MainPageInd";
// import MainPageCor from "./pages/MainPageCor";
import FeedDetailPageCor from "./pages/FeedDetailPageCor";
import FeedDetailPageInd from "./pages/FeedDetailPageInd";
import FeedFormPageCor from "./pages/FeedFormPageCor";
import FeedFormPageInd from "./pages/FeedFormPageInd";
import Not404 from "./pages/Not404";
import MainPageCor from "./pages/MainPageCor";

import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  function getCookie(name: string) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
      return parts.pop()!.split(";").shift();
    }
  }

  useEffect(() => {
    const accessToken = getCookie("access_token");
    const userInfoString = getCookie("user_info");

    if (accessToken && userInfoString) {
      try {
        const decodedUserInfo = atob(userInfoString);
        const userInfo: UserInfo = JSON.parse(decodedUserInfo);

        dispatch(login(userInfo));
      } catch (error) {
        console.error("Error decoding user info:", error);
      }
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
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
