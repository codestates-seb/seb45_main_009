import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/loginSlice";
import { Feed, User } from "../../types/types";
import { BiSearch } from "react-icons/bi/";
import { IoNotificationsOutline } from "react-icons/io5/";
import { RiMenuUnfoldFill, RiMenuFoldFill } from "react-icons/ri";
import { RootState } from "../../types/types";
import globalAxios from "../../data/data";
import { setFilteredData } from "../../redux/reducers/feedSlice";
import { RootStates } from "../../types/types";

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

  // const allData = useSelector((state: RootState) => state.allData);
  // // console.log(allData);
  // const users: User[] = allData.users; // users 타입을 User[]로 명시
  // const feeds: Feed[] = allData.feeds; // feeds 타입을 Feed[]로 명시

  const [search, setSearch] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [autoCompleteData, setAutoCompleteData] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([
    "헬스",
    "한강",
    "헬스장",
  ]);

  const fetchFilteredData = async () => {
    try {
      const response = await globalAxios.get(`feed/search?keyword=${search}`);
      const data = response.data;

      const filteredUsers = data.users;
      const filteredFeeds = data.feeds;

      const mergedData = [...filteredUsers, ...filteredFeeds];

      dispatch(setFilteredData(mergedData));
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearch(inputValue);

    if (inputValue.trim() !== "") {
      // 검색어 추천 목록을 가져오는 코드를 작성
      const filteredSuggestions: string[] = suggestions.filter((suggestion) =>
        suggestion.includes(inputValue)
      );

      setAutoCompleteData(filteredSuggestions);
      setShowAutoComplete(true);
    } else {
      setAutoCompleteData([]);
      setShowAutoComplete(false);
    }
  };

  //클릭시 자동 필터링 및 검색창에 글 올라감
  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowAutoComplete(false);

    const searchInput = document.querySelector<HTMLInputElement>("#search");
    if (searchInput) {
      searchInput.value = suggestion;
    }

    fetchFilteredData();
  };

  //엔터시 자동 필터링 공백시 초기화
  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const inputValue = search.trim();

      if (inputValue !== "") {
        fetchFilteredData();
      } else {
        setSearch("");
        setShowAutoComplete(false);
        dispatch(setFilteredData([]));
      }
    }
  };

  // 다른곳 클릭시 autoComplete 사라짐
  useEffect(() => {
    const closeAutoComplete = () => {
      setShowAutoComplete(false);
    };

    document.addEventListener("click", closeAutoComplete);

    return () => {
      document.removeEventListener("click", closeAutoComplete);
    };
  }, []);

  return (
    <header className="flex justify-center items-center m-2">
      <Link to="/">
        {!isMobile && (
          <div className="flex justify-center hover:cursor-pointer">
            <img src="/asset/fitfolio.svg" alt="logo" />
          </div>
        )}
      </Link>
      <div className="flex items-center min-w-[190px] h-[3vh] w-[50vw] max-w-[500px] border  p-1 sm:mr-2 sm:h-[4vh]">
        <BiSearch size="24" />
        <input
          id="search"
          className="w-full outline-none text-[8px] sm:text-sm"
          placeholder="검색하실 ID 또는 #태그를 입력하세요."
          onChange={handleInputChange}
          onKeyDown={handleEnterKeyPress}
        />
      </div>
      {showAutoComplete && autoCompleteData.length > 0 && (
        <div className="mt-2 w-[50vw] min-w-[190px] max-w-[500px] bg-white border border-gray-300  shadow-lg absolute top-[3.2rem] left-[36.4vw]">
          <ul>
            {autoCompleteData.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isMobile ? (
        <>
          <div className="ml-3" onClick={toggleModal}>
            {isModalOpen ? (
              <RiMenuFoldFill size="24" />
            ) : (
              <RiMenuUnfoldFill size="24" />
            )}
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
                    <button
                      className="mb-4 hover:text-btn-color"
                      onClick={handleMenuClick}
                    >
                      마이페이지
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button
                      className="my-4 hover:text-btn-color"
                      onClick={handleMenuClick}
                    >
                      로그인
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button
                      className="mb-4 hover:text-btn-color"
                      onClick={handleMenuClick}
                    >
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
        <div className="flex text-[0.8rem] lg:text-base">
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
              <button
                className="text-xs mr-2 sm:mr-4 sm:text-base hover:text-btn-color"
                onClick={handleMenuClick}
              >
                로그인
              </button>
            </Link>
            <Link to="/signup">
              <button
                className="text-xs sm:text-base hover:text-btn-color"
                onClick={handleMenuClick}
              >
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
