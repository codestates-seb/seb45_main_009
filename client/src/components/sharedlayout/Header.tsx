import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/reducers/loginSlice";

import { UserInfo } from "../../types/types";

interface RootState {
  login: {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
  };
}

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
  const logoutHandler = () => {
    dispatch(logout());
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user_info");
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center m-2">
      <Link to="/">
        <div className=" ml-4 hover:cursor-pointer">
          <img src="/asset/fitfolio.png" alt="logo" className="w-[250]" />
        </div>
      </Link>
      <div className="flex h-8 w-4/12 border rounded-2xl p-1 mr-4">
        <img src="/asset/search.png" alt="search" className="mr-2 w-6" />
        <input
          className="w-full outline-none"
          placeholder="검색하실 ID 또는 #태그를 입력하세요."
        ></input>
      </div>
      <div className=" w-6 mr-4 hover:cursor-pointer">
        <img src="/asset/notify.png" alt="notify"></img>
      </div>
      <div className="flex">
        {isAuthenticated ? (
          <>
            <button className="mr-4 hover:text-btn-color" onClick={logoutHandler}>
              로그아웃
            </button>
            <Link to="*">
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
