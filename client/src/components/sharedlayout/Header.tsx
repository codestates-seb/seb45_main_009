import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/reducers/loginSlice";

import { UserInfo } from "../../types/types";
import { BiSearch } from "react-icons/bi/";
import { IoNotificationsOutline } from "react-icons/io5/";

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

  return (
    <header className="flex justify-center items-center m-2">
      <Link to="/">
        <div className="flex justify-center hover:cursor-pointer w-[20vw] sm:ml-4">
          <img src="/asset/fitfolio.svg" alt="logo" />
        </div>
      </Link>
      <div className="flex items-center h-[3vh] w-4/12 border rounded-3xl p-1 sm:mr-2 sm:h-[4vh]">
        <BiSearch size="24"></BiSearch>
        <input
          className="w-full outline-none text-[8px] sm:text-sm"
          placeholder="검색하실 ID 또는 #태그를 입력하세요."
        ></input>
      </div>
      <div className=" items-center mx-2 sm:mr-4  hover:cursor-pointer">
        <IoNotificationsOutline size="22"></IoNotificationsOutline>
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
              <button className="text-xs mr-2 sm:mr-4 sm:text-base hover:text-btn-color">
                로그인
              </button>
            </Link>
            <Link to="/signup">
              <button className="text-xs sm:mr-8 sm:text-base hover:text-btn-color">
                회원가입
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
