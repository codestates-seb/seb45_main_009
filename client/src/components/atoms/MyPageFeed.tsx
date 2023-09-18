import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { UserInfo } from "../../types/types";
import { useLocation } from "react-router";
import globalAxios from "../../data/data";
import { Link } from "react-router-dom";
import { RootStates } from "../../types/types";
import noFeed from "../../assets/images/nofeed.png";

interface UserData {
  bio: string;
  createdAt: string;
  email: string;
  height: number;
  location: string;
  modifiedAt: string;
  nickname: string;
  price: number | string;
  profileimg: string;
  roles: string[];
  userId: number;
  weight: number;
}

interface FeedData {
  bio: string;
  feedId: number;
  nickname: string;
  profileImageUrl: string;
  content: string;
  relatedTags: string[];
  images: {
    imageId: number;
    imageUrl: string;
    imageTags: string[];
  }[];
}

interface RootState {
  login: {
    isAuthenticated: boolean;
    userInfo: UserInfo;
  };
}

const MyPageFeed = () => {
  const userInfo = useSelector((state: RootState) => state.login.userInfo);
  const { allUserDatas } = useSelector((state: RootStates) => state.feed);

  const [allFeedData, setAllFeedData] = useState<FeedData[]>([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [ref, inView] = useInView();

  const currentPage = userInfo.userType === "USER" ? "/" : "/store";

  const PAGE_SIZE = 4; // 페이지당 데이터 개수

  const currentDetail = userInfo.userType === "USER" ? "feeddetailind" : "/feeddetailcor";
  const getMainListData = async () => {
    try {
      setLoading(true);

      // 서버에서 페이지네이션을 고려하여 데이터를 가져옴
      const response = await globalAxios.get(currentPage, {
        params: { page, pageSize: PAGE_SIZE },
      });
      const getData = response.data.feedList;

      if (getData.length === 0) {
        // 더 이상 데이터가 없는 경우
        setHasMore(false);
      } else {
        // 이전 데이터와 새로운 데이터 합치기
        setAllFeedData((prevData) => [...prevData, ...getData]);
        setPage((prevPage) => prevPage + 1);
      }

      setLoading(false);
    } catch (err) {
      console.log("Error >>", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inView && !loading && hasMore) {
      getMainListData();
    }
  }, [inView, loading, hasMore]);

  useEffect(() => {
    getMainListData();
  }, [userInfo]);

  const IntroductionCss = " border border-bdc rounded-xl  p-10 h-full min-h-[200px] m-8 w-[50%] md:w-auto ";

  const MainBodyCss = " flex justify-center mt-10 items-center md:items-start";
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const user = allUserDatas.find((userData) => userData.nickname === userInfo.userNickname);

  const userFeed = allFeedData.filter((userData) => userData.nickname === userInfo.userNickname);
  return (
    <section>
      <div className={`flex w-max-xl ${windowWidth < 768 ? "flex-col" : "flex-row"}  ${MainBodyCss} `}>
        {userInfo.userType === "USER" ? (
          <aside className="flex flex-col px-6 py-10 mr-4 max-768:flex-row">
            <div className="flex items-center flex-col max-768:mr-4 max-768:mt-0 max-768:mr-10">
              <img
                src={user?.profileimg}
                alt="myimg"
                className="mb-2 w-[200px] h-[200px] min-w-[200px] min-h-[200px] border rounded-full 
              max-mobile:w-[120px] max-mobile:h-[120px] max-mobile:min-w-[120px] max-mobile:min-h-[120px] "
              />
            </div>
            <div className="flex flex-col max-768:justify-center">
              <div className="flex justify-center font-semibold text-lg mb-4 max-mobile:text-sm">{user?.nickname}</div>
              <div className="flex mb-2 max-mobile:flex-col max-mobile:mb-0">
                <div className="max-mobile:text-sm">
                  <span className="font-bold mr-2">키</span>
                  <span className="mr-4">{user?.height ? `${user?.height}cm` : "0 cm"}</span>
                </div>
                <div className="max-mobile:text-sm">
                  <span className="font-bold mr-2">몸무게</span>
                  <span>{user?.weight ? `${user?.weight}kg` : "0 kg"}</span>
                </div>
              </div>
              <div className="mb-2 max-mobile:text-sm max-mobile:mb-0">
                <span className="max-w-[200]">
                  <span className="font-bold mr-2">주 종목</span> <span>{user?.sport ? user?.sport : "없음"}</span>
                </span>
              </div>
              <div className="mb-2 max-mobile:text-sm">
                <span className="max-w-[200]">
                  <span className="font-bold mr-2">소개</span>{" "}
                  <span className="opacity-75">{user?.bio ? user?.bio : "없음"}</span>
                </span>
              </div>
            </div>
          </aside>
        ) : (
          <aside className="flex flex-col px-4 mr-4 max-768:flex-row">
            <div className="flex items-center flex-col mt-20   max-768:mr-4 max-768:mt-0 max-768:mr-10">
              <img
                src={user?.profileimg}
                alt="myimg"
                className="mb-2 w-[200px] h-[200px] min-w-[200px] min-h-[200px] border rounded-full 
              max-mobile:w-[120px] max-mobile:h-[120px] max-mobile:min-w-[120px] max-mobile:min-h-[120px] "
              />
            </div>
            <div className="flex flex-col max-768:justify-center max-w-[200px]">
              <div className="flex justify-center font-semibold text-lg mb-4 max-mobile:text-sm">{user?.nickname}</div>
              <div className="mb-2 max-mobile:text-sm max-mobile:mb-0">
                <span className="max-w-[200]">
                  <span className="font-bold mr-2">주소</span> <span>{user?.location ? user?.location : "없음"}</span>
                </span>
              </div>
              <div className="mb-2 max-mobile:text-sm max-mobile:mb-0">
                <span className="max-w-[200]">
                  <span className="font-bold mr-2">주 종목</span> <span>{user?.sport ? user?.sport : "없음"}</span>
                </span>
              </div>
              <div className="mb-2 max-mobile:text-sm">
                <span className="max-w-[200]">
                  <span className="font-bold mr-2">소개</span> <span>{user?.bio ? user?.bio : "없음"}</span>
                </span>
              </div>
              <div className="mb-2 max-mobile:text-sm">
                <span className="max-w-[200]">
                  <span className="font-bold mr-2">가격 정보</span> <span>{user?.price ? user?.price : "없음"}</span>
                </span>
              </div>
            </div>
          </aside>
        )}
        {userFeed.length !== 0 ? (
          <section className="grid max-mobile:grid-cols-1 max-tablet:grid-cols-2 grid-cols-3 gap-2 h-full mb-24">
            {userFeed.map((user, idx) => (
              <article
                key={idx}
                className="flex justify-center items-center  hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-[5px_5px_10px_rgba(0,0,0,0.2)]"
              >
                <Link to={`/${currentDetail}/${user.feedId}`}>
                  <img
                    src={user.images[0].imageUrl}
                    alt={`ProfileImg of ${user.feedId}`}
                    className="w-[250px] h-[250px] object-cover border"
                  />
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <div>
            <img src={noFeed} alt="noFeedImage"></img>
          </div>
        )}
      </div>
      <div ref={ref}></div>
    </section>
  );
};

export default MyPageFeed;
