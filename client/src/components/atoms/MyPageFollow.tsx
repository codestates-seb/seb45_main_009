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
const MyPageFollow = () => {
  const tempDataString = localStorage.getItem("tempData");
  const tempData = tempDataString ? JSON.parse(tempDataString) : [];

  const [page, setPage] = useState(8);

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
    <div className="flex justify-center flex-col items-center mt-5">
      <div className="grid grid-cols-4 gap-12 mb-24">
        <div className="flex items-center">
          <img src="/asset/star.png" alt="starimg" />
          <p className="text-2xl font-bold ml-4">팔로우 목록</p>
        </div>
        <div className="col-span-3"></div>
        {chunkData.map((user: UserData, idx: number) => (
          <div key={idx} className="flex items-center">
            <img src={user.proFileImg} alt="profile" className="w-14 h-14" />
            <div className="mx-5">
              <div className="font-bold">{user.userId}</div>
              <div className="flex">
                <p className="mr-3">165cm</p>
                <p>50kg</p>
              </div>
            </div>
            <div>
              {user.location === "서울" && (
                <img src="/asset/mark.png" alt="mark" className="w-5 h-5" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div ref={ref}></div>
    </div>
  );
};

export default MyPageFollow;
