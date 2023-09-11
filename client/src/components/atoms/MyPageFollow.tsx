import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AiFillStar } from "react-icons/ai";
import { IoIosCheckmarkCircle } from "react-icons/io";

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
  const [followers, setFollowers] = useState<UserData[]>(tempData);
  const [following, setFollowing] = useState<UserData[]>(tempData);
  const [isFollowingView, setIsFollowingView] = useState(false);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;
  const chunkData = isFollowingView
    ? following.slice(0, startIndex + PAGE_SIZE)
    : followers.slice(0, startIndex + PAGE_SIZE);

  const deleteUserHandler = (userId: string) => {
    const updatedFollowers = followers.filter((user) => user.userId !== userId);
    const updatedFollowing = following.filter((user) => user.userId !== userId);
    setFollowers(updatedFollowers);
    setFollowing(updatedFollowing);

    localStorage.setItem("tempData", JSON.stringify(updatedFollowers));
  };

  const toggleFollowingView = (view: boolean) => {
    setIsFollowingView(view);
  };

  return (
    <div className="flex justify-center flex-col items-center mt-5">
      <section className="grid  grid-cols-1 gap-8 h-full mb-24 mx-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 ">
        <div className="flex items-center">
          <AiFillStar size="40" color="#FFEA00" />
          <p className="text-2xl font-bold ml-4">
            {isFollowingView ? "팔로잉 목록" : "팔로워 목록"}
          </p>
        </div>
        <span className="col-span-1 md:col-span-2 lg:col-span-3"></span>
        <span className="col-span-1 md:col-span-2 lg:col-span-3"></span>
        <div className="flex justify-end w-full">
          <div
            className={`mr-10 cursor-pointer ${
              isFollowingView ? "" : "text-blue-500"
            }`}
            onClick={() => toggleFollowingView(false)}
          >
            팔로워
          </div>
          <div
            className={`mr-10 cursor-pointer ${
              isFollowingView ? "text-blue-500" : ""
            }`}
            onClick={() => toggleFollowingView(true)}
          >
            팔로잉
          </div>
        </div>
        {chunkData.map((user: UserData, idx: number) => (
          <article key={idx} className="flex items-center">
            <img src={user.proFileImg} alt="profile" className="w-14 h-14" />
            <div className="mx-3">
              <div className="flex items-center">
                <div className="font-bold mr-2">{user.userId}</div>
                <div>
                  {user.location === "서울" && (
                    <IoIosCheckmarkCircle color="red" />
                  )}
                </div>
              </div>
              <div className="flex w-full">
                <p className="mr-3">165cm</p>
                <p>50kg</p>
              </div>
            </div>
            <button
              onClick={() => deleteUserHandler(user.userId)}
              className="flex justify-end text-red-500 w-full"
            >
              삭제
            </button>
          </article>
        ))}
      </section>
      <div ref={ref}></div>
    </div>
  );
};

export default MyPageFollow;
