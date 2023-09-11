import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import globalAxios from "../../data/data";

interface UserData {
  proFileImg: string;
  userId: string;
  feedImg: string;
  userInfo: string;
  tags: string;
  location: string;
}

interface FeedProps {
  selectedFilter: string[];
}

const tempData: UserData[] = [
  {
    proFileImg: "/asset/profile.png",
    userId: "ImHello",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "헬스",
    location: "서울",
  },
  {
    proFileImg: "/asset/github.png",
    userId: "ImTaeyoung",
    feedImg: "/asset/feedpicture.png",
    userInfo: "서울은 비가 올거 같아요",
    tags: "헬스",
    location: "서울",
  },
  {
    proFileImg: "/asset/gym.png",
    userId: "버피짐",
    feedImg: "/asset/gym.png",
    userInfo: "오운완!",
    tags: "헬스",
    location: "경기",
  },
  {
    proFileImg: "/asset/gym1.png",
    userId: "ID123",
    feedImg: "/asset/think.png",
    userInfo: "뛰나요?",
    tags: "크로스핏",
    location: "경기",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID777",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "크로스핏",
    location: "서울",
  },
  {
    proFileImg: "/asset/smile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "크로스핏",
    location: "인천",
  },
  {
    proFileImg: "/asset/gym1.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "수영",
    location: "강원",
  },
  {
    proFileImg: "/asset/gym.png",
    userId: "ID888888",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "수영",
    location: "서울",
  },
  {
    proFileImg: "/asset/cat.png",
    userId: "헬스냥이",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "수영",
    location: "서울",
  },
  {
    proFileImg: "/asset/think.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "홈트",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "홈트",
    location: "인천",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "축구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "축구",
    location: "부산",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "축구",
    location: "부산",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "농구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "농구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "농구",
    location: "서울",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
    location: "서울",
  },
];

localStorage.setItem("tempData", JSON.stringify(tempData));
const tempDataString = localStorage.getItem("tempData");
const tempDatas = tempDataString ? JSON.parse(tempDataString) : [];

const Feed = ({ selectedFilter }: FeedProps) => {
  const [allData, setAllData] = useState<UserData[]>(tempDatas);
  const [page, setPage] = useState(2);

  const [ref, inView] = useInView();

  const [abc, setABC] = useState();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;
  const chunkData = allData.slice(0, startIndex + PAGE_SIZE);

  const filteredData = selectedFilter.includes("전체")
    ? chunkData
    : chunkData.filter(
        (user) =>
          selectedFilter.includes(user.tags) ||
          selectedFilter.includes(user.location)
      );

  const location = useLocation();
  const currentFeed =
    location.pathname === "/" ? "/feedformind" : "/feedformcor";
  const currentDetail =
    location.pathname === "/" ? "/feeddetailind" : "/feeddetailcor";

  const getMainListData = async () => {
    try {
      const response = await globalAxios.get("/feed/detail/1");
      const getData = response.data;
      //setAllData(getData.data);
      setABC(getData.data);
      console.log("response >>", getData);
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  useEffect(() => {
    getMainListData();
  }, []);

  return (
    <section className="flex justify-center flex-col items-center ">
      <div>
        <div className="flex justify-center md:justify-end mr-4">
          <Link
            to={currentFeed}
            className="fixed bottom-0 md:static px-8 py-2 rounded-xl mb-5 bg-feedbtn-color hover:bg-feedbtnhover-color"
          >
            피드 올리기
          </Link>
        </div>

        <section className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  mb-24">
          {filteredData.map((user) => (
            <article key={user.userId} className="  mb-4 min-w-[250px]">
              <div className="flex mb-4">
                <img
                  src={user.proFileImg}
                  alt={`ProfileImg of ${user.userId}`}
                  className="rounded-full border mr-2 w-10 h-10"
                />
                <div className="ml-2">
                  <p>{user.userId}</p>
                  <p className="text-gray-400">{user.userInfo}</p>
                </div>
              </div>
              <Link to={currentDetail}>
                <div>
                  <img
                    src={user.feedImg}
                    alt={`FeedImg of ${user.userId}`}
                    className="w-[13vw] h-[30vh] object-cover min-w-[250px] border"
                  />
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>

      <div ref={ref}></div>
    </section>
  );
};

export default Feed;
