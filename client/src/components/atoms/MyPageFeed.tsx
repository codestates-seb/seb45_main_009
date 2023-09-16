import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import { UserInfo } from "../../types/types";
import { useLocation } from "react-router";
import globalAxios from "../../data/data";

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

  const [allFeedData, setAllFeedData] = useState<FeedData[]>([]);
  const [allUserData, setAllUserData] = useState<UserData[]>([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [ref, inView] = useInView();

  const currentPage = userInfo.userType === "USER" ? "/" : "/store";

  const PAGE_SIZE = 4; // 페이지당 데이터 개수

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

  const getUserData = async () => {
    try {
      const response = await globalAxios.get("/users");
      const getData = response.data.content;
      setAllUserData(getData);
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  useEffect(() => {
    if (inView && !loading && hasMore) {
      getMainListData();
      getUserData();
    }
  }, [inView, loading, hasMore]);

  const IntroductionCss =
    " border border-gray-400 rounded-xl  p-10 h-full min-h-[200px] m-8 w-[50%] md:w-auto";

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

  const user = allUserData.find(
    (userData) => userData.nickname === userInfo.userNickname
  );

  const userFeed = allFeedData.filter(
    (userData) => userData.nickname === userInfo.userNickname
  );

  return (
    <section>
      <div
        className={`flex w-max-xl ${
          windowWidth < 768 ? "flex-col" : "flex-row"
        }  ${MainBodyCss} `}
      >
        <aside
          className={` ${
            windowWidth < 768 ? "" : " sticky top-24"
          } md:${IntroductionCss}`}
        >
          <div className="flex items-center flex-col mb-10">
            <img
              src={user?.profileimg}
              alt="myimg"
              className="mb-5 w-[10vw] border rounded-full "
            />
            <div className="font-bold text-xl">{user?.nickname}</div>
          </div>
          <div className="text-gray-500 flex flex-col">
            <div className="mb-5">
              키<div>{user?.height}</div>
            </div>
            <div className="mb-5">
              몸무게
              <div>{user?.weight}</div>
            </div>
            <div className="mb-5">
              자기소개
              <div className="max-w-[200]">{user?.bio}</div>
            </div>
          </div>
        </aside>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full mb-24">
          {userFeed.map((user, idx) => (
            <article key={idx} className="flex justify-center items-center">
              <img
                src={user.images[0].imageUrl}
                alt={`ProfileImg of ${user.feedId}`}
                className="w-[80vw] h-[80vw] object-cover md:w-[25vw] md:h-[25vw] lg:w-[15vw] lg:h-[15vw]"
              ></img>
            </article>
          ))}
        </section>
      </div>
      <div ref={ref}></div>
    </section>
  );
};

export default MyPageFeed;
