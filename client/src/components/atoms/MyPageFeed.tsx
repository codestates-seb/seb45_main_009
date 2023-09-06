import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface UserData {
  proFileImg: string;
  userId: string;
  feedImg: string;
  userInfo: string;
  tags: string;
  location: string;
}

const MyPageFeed = () => {
  const tempDataString = localStorage.getItem("tempData");
  const tempData = tempDataString ? JSON.parse(tempDataString) : [];

  const [page, setPage] = useState(3);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;
  const chunkData = tempData.slice(0, startIndex + PAGE_SIZE);

  return (
    <div>
      <div className="flex justify-center mt-10">
        <div className=" border border-gray-400 rounded-xl mr-20 p-10 h-full min-h-[200px] sticky top-24">
          <div className="flex items-center flex-col mb-10">
            <img
              src={tempData[8].proFileImg}
              alt="myimg"
              className="mb-5 w-[150px] border rounded-full "
            />
            <div className="font-bold text-xl">{tempData[8].userId}</div>
          </div>
          <div className="text-gray-500 flex flex-col">
            <div className="mb-5">
              키<div>20cm</div>
            </div>
            <div className="mb-5">
              몸무게
              <div>3kg</div>
            </div>
            <div className="mb-5">
              자기소개
              <div className="max-w-[200]">안녕하세요</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 h-full mb-24">
          {chunkData.map((user: UserData, idx: number) => (
            <div key={idx}>
              <img
                src={user.feedImg}
                alt={`ProfileImg of ${user.userId}`}
                className="w-[200px] h-[200px] object-cover"
              ></img>
            </div>
          ))}
        </div>
      </div>
      <div ref={ref}>gdgdgd</div>
    </div>
  );
};

export default MyPageFeed;
