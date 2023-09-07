import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { login } from "./redux/reducers/loginSlice";

import { UserInfo } from "./types/types";

import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Loginaddition from "./pages/Loginaddition";

import MainPageInd from "./pages/MainPageInd";
// import MainPageCor from "./pages/MainPageCor";
import FeedDetailPageCor from "./pages/FeedDetailPageCor";
import FeedDetailPageInd from "./pages/FeedDetailPageInd";
import FeedFormPageCor from "./pages/FeedFormPageCor";
import FeedFormPageInd from "./pages/FeedFormPageInd";
import Not404 from "./pages/Not404";
import MainPageCor from "./pages/MainPageCor";
import MyPage from "./pages/MyPage";
import ChangePassword from "./components/atoms/ChangePassword";

import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    const userInfoString = sessionStorage.getItem("user_info");

    if (accessToken && userInfoString) {
      try {
        const userInfo: UserInfo = JSON.parse(userInfoString);

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
        <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/loginaddition" element={<Loginaddition />}></Route>
          <Route path="/" element={<MainPageInd />}></Route>
          <Route path="/store" element={<MainPageCor />}></Route>
          <Route path="/feeddetailcor" element={<FeedDetailPageCor />}></Route>
          <Route path="/feeddetailind" element={<FeedDetailPageInd />}></Route>
          <Route path="/feedformcor" element={<FeedFormPageCor />}></Route>
          <Route path="/feedformind" element={<FeedFormPageInd />}></Route>
          <Route path="*" element={<Not404 />} />
        </Routes>
        </div>
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
