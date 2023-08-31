import React from "react";
import Filter from "./Filter";
import { Link } from "react-router-dom";

const tempData = [
  {
    proFileImg: "/asset/profile.png",
    userId: "ImHello",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ImTaeyoung",
    feedImg: "/asset/feedpicture.png",
    userInfo: "서울은 비가 올거 같아요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ImAGoodBoy",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오운완!",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123",
    feedImg: "/asset/feedpicture.png",
    userInfo: "뛰나요?",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID777",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "IDABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID123ABC",
    feedImg: "/asset/feedpicture.png",
    userInfo: "오늘은 날씨가 좋네요",
  },
  {
    proFileImg: "/asset/profile.png",
    userId: "ID888888",
    feedImg: "/asset/test.png",
    userInfo: "팬티 단돈 99000원",
  },
];

const Feed = () => {
  const chunkedData = [];
  for (let i = 0; i < tempData.length; i += 4) {
    chunkedData.push(tempData.slice(i, i + 4));
  }

  return (
    <div className="flex justify-center flex-col items-center ">
      <div>
        <Link to={"/feedformind"}>
          <div className="flex justify-end mr-4">
            <button className=" px-8 py-2 rounded-xl mb-5 bg-feedbtn-color hover:bg-feedbtnhover-color">
              피드 올리기
            </button>
          </div>
        </Link>
        {chunkedData.map((chunk, index) => (
          <div key={index} className="flex mb-4 ">
            {chunk.map((user, idx) => (
              <div key={idx} className="flex flex-col mx-4">
                <div className="flex mb-4 max-w-10 max-h-10 ">
                  <img
                    src={user.proFileImg}
                    alt={`ProfileImg of ${user.userId}`}
                    className="rounded-full border mr-2 "
                  />

                  <div className="ml-2 ">
                    <p>{user.userId}</p>
                    <p className="text-gray-400">{user.userInfo}</p>
                  </div>
                </div>
                <div>
                  <img
                    src={user.feedImg}
                    alt={`FeedImg of ${user.userId}`}
                    className="w-[240] h-[240] object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
