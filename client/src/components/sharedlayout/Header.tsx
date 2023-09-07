import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/reducers/loginSlice";

import { UserInfo } from "../../types/types";
import { BiSearch } from "react-icons/bi/";
import { IoNotificationsOutline } from "react-icons/io5/";

import { useLocation } from "react-router-dom";

interface RootState {
  login: {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
  };
}

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated
  );
  const logoutHandler = () => {
    dispatch(logout());
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user_info");
    navigate("/");
  };

  //oauthloading에서 제외
  const location = useLocation();
  if (location.pathname === "/oauthloading") {
    return null;
  }

  return (
    <div className="flex justify-center items-center m-2">
      <Link to="/">
        <div className=" ml-4 hover:cursor-pointer">
          <img src="/asset/fitfolio.png" alt="logo" className="w-[250]" />
        </div>
      </Link>
      <div className="flex h-8 w-4/12 border rounded-2xl p-1 mr-4">
        <BiSearch size="24"></BiSearch>
        <input
          className="w-full outline-none"
          placeholder="검색하실 ID 또는 #태그를 입력하세요."
        ></input>
      </div>
      <div className=" w-6 mr-4 hover:cursor-pointer">
        <IoNotificationsOutline size="24"></IoNotificationsOutline>
      </div>
      <div className="flex">
        {isAuthenticated ? (
          <>
            <button
              className="mr-4 hover:text-btn-color"
              onClick={logoutHandler}
            >
              로그아웃
            </button>
            <Link to="/mypage/:page">
              <button className="mr-8 hover:text-btn-color">마이페이지</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="mr-4 hover:text-btn-color">로그인</button>
            </Link>
            <Link to="/signup">
              <button className="mr-8 hover:text-btn-color">회원가입</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
