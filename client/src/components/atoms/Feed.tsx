import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

interface UserData {
  proFileImg: string;
  userId: string;
  feedImg: string;
  userInfo: string;
  tags: string;
}

interface FeedProps {
  selectedFilter: string;
}

const tempData: UserData[] = [
  {
    proFileImg: "/asset/profile.png",
    userId: "ImHello",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "헬스",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ImTaeyoung",
    feedImg: "/asset/feedpicture.png",
    userInfo: "서울은 비가 올거 같아요",
    tags: "헬스",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ImAGoodBoy",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오운완!",
    tags: "헬스",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123",
    feedImg: "/asset/feedpicture.png",
    userInfo: "뛰나요?",
    tags: "크로스핏",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID777",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "크로스핏",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "크로스핏",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "수영",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "수영",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "수영",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "홈트",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "홈트",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "축구",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "축구",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "축구",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
    tags: "농구",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
    tags: "농구",
  },
];

const PAGE_SIZE = 4;

const Feed = ({ selectedFilter }: FeedProps) => {
  const [allData, setAllData] = useState<UserData[]>(tempData);
  const [page, setPage] = useState(2);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
      console.log(inView);
    }
  }, [inView]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const chunkData = allData.slice(0, startIndex + PAGE_SIZE);

  const filteredData =
    selectedFilter === "전체"
      ? chunkData
      : chunkData.filter((user) => user.tags === selectedFilter);

  return (
    <div className="flex justify-center flex-col items-center">
      <div>
        <div className="flex justify-end mr-4">
          <Link to={"/feedformind"}>
            <button className="px-8 py-2 rounded-xl mb-5 bg-feedbtn-color hover:bg-feedbtnhover-color">
              피드 올리기
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 ">
          {filteredData.map((user, idx) => (
            <div key={idx} className=" mx-4 mb-4">
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
              <div>
                <img
                  src={user.feedImg}
                  alt={`FeedImg of ${user.userId}`}
                  className="w-[300px] h-[350px] object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div ref={ref}>여기다</div>
    </div>
  );
};

export default Feed;
