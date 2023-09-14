import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/loginSlice";
import { UserInfo } from "../../types/types";
import { BiSearch } from "react-icons/bi/";
import { IoNotificationsOutline } from "react-icons/io5/";
import { RiMenuUnfoldFill, RiMenuFoldFill } from "react-icons/ri";
import { RootState } from "../../types/types";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
  const userInfo = useSelector((state: RootState) => state.login.userInfo);
  const logoutHandler = () => {
    dispatch(logout());
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user_info");
    navigate("/");
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleModal = () => {
    setIsModalOpen((prevIsModalOpen) => !prevIsModalOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMenuClick = () => {
    if (isMobile && isModalOpen) {
      closeModal();
    }
  };

  return (
    <header className="flex justify-center items-center m-2">
      <Link to="/">
        {!isMobile && (
          <div className="flex justify-center hover:cursor-pointer">
            <img src="/asset/fitfolio.svg" alt="logo" />
          </div>
        )}
      </Link>
      <div className="flex items-center h-[3vh] w-[50vw] max-w-[500px] border rounded-3xl p-1 sm:mr-2 sm:h-[4vh]">
        <BiSearch size="24" />
        <input
          className="w-full outline-none text-[8px] sm:text-sm"
          placeholder="검색하실 ID 또는 #태그를 입력하세요."
        />
      </div>
      {isMobile ? (
        <>
          <div className="ml-3" onClick={toggleModal}>
            {isModalOpen ? <RiMenuFoldFill size="24" /> : <RiMenuUnfoldFill size="24" />}
          </div>
          {isModalOpen && (
            <div className="fixed top-0 right-0 bottom-0 left-0 bg-white z-50 flex flex-col items-center animate-slide-right">
              <div className="flex justify-center hover:cursor-pointer">
                <img src="/asset/fitfolio.svg" alt="logo" />
              </div>
              {isAuthenticated ? (
                <>
                  <button
                    className="my-4 hover:text-btn-color"
                    onClick={() => {
                      logoutHandler();
                      handleMenuClick();
                    }}
                  >
                    로그아웃
                  </button>
                  <Link to="/mypage/feed">
                    <button className="mb-4 hover:text-btn-color" onClick={handleMenuClick}>
                      마이페이지
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="my-4 hover:text-btn-color" onClick={handleMenuClick}>
                      로그인
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="mb-4 hover:text-btn-color" onClick={handleMenuClick}>
                      회원가입
                    </button>
                  </Link>
                </>
              )}
              <div className="my-4">
                <IoNotificationsOutline size="22" />
              </div>
              <button onClick={closeModal}>닫기</button>
            </div>
          )}
        </>
      ) : (
        <>
          {isAuthenticated && (
            <div className="items-center mx-2 sm:mr-4 hover:cursor-pointer">
              <Link to="/alarmpage">
                <IoNotificationsOutline size="22" />
              </Link>
            </div>
          )}
        </>
      )}
      {!isMobile && isAuthenticated ? (
        <div className="flex">
          <button className="mr-4 hover:text-btn-color" onClick={logoutHandler}>
            로그아웃
          </button>
          <Link to="/mypage/feed">
            <button className="hover:text-btn-color">마이페이지</button>
          </Link>
        </div>
      ) : (
        !isMobile && (
          <div className="flex">
            <Link to="/login">
              <button className="text-xs mr-2 sm:mr-4 sm:text-base hover:text-btn-color" onClick={handleMenuClick}>
                로그인
              </button>
            </Link>
            <Link to="/signup">
              <button className="text-xs sm:text-base hover:text-btn-color" onClick={handleMenuClick}>
                회원가입
              </button>
            </Link>
          </div>
        )
      )}
    </header>
  );
}

export default Header;
