import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AiFillStar } from "react-icons/ai";
import { IoIosCheckmarkCircle } from "react-icons/io";
import globalAxios from "../../data/data";
import { useSelector } from "react-redux";
import { RootState } from "../../types/types";
import { Link, useLocation } from "react-router-dom";

interface UserData {
  profileimg: string;
  userId: string;
  nickname: string;
  bio: string;
}

const MyPageFollow = () => {
  const [page, setPage] = useState(8);
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [following, setFollowing] = useState<UserData[]>([]);
  const [isFollowingView, setIsFollowingView] = useState(false);

  const [ref, inView] = useInView();

  const userInfo = useSelector((state: RootState) => state.login.userInfo);

  console.log(userInfo);

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
  console.log(chunkData, "chunkData");
  const deleteUserHandler = (userId: string) => {
    const updatedFollowers = followers.filter((user) => user.userId !== userId);
    const updatedFollowing = following.filter((user) => user.userId !== userId);
    setFollowers(updatedFollowers);
    setFollowing(updatedFollowing);
  };

  const toggleFollowingView = (view: boolean) => {
    setIsFollowingView(view);
  };

  const isFollow = isFollowingView ? "following" : "followers";
  console.log(isFollow);
  const getUserData = async () => {
    try {
      const response = await globalAxios.get(
        `/follow/${isFollow}/${userInfo.userId}`
      );
      const getData = response.data;
      console.log(getData, "여기다");
      if (isFollowingView) {
        setFollowing(getData);
      } else {
        setFollowers(getData);
      }
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  useEffect(() => {
    getUserData();
    console.log(chunkData);
  }, [isFollowingView, userInfo]);

  const unfollowUser = async (userId: string) => {
    try {
      // POST 요청을 보내어 해당 사용자를 언팔로우
      await globalAxios.post(`/follow/${userId}`);
      // 사용자 목록에서 삭제
      const updatedFollowers = followers.filter(
        (user) => user.userId !== userId
      );
      const updatedFollowing = following.filter(
        (user) => user.userId !== userId
      );
      setFollowers(updatedFollowers);
      setFollowing(updatedFollowing);
    } catch (err) {
      console.error("Error:", err);
    }
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
        {chunkData.map((user, idx) => (
          <article key={idx} className="flex items-center">
            <Link to={`/profile/${user.userId}`}>
              <img
                src={user.profileimg}
                alt="profile"
                className="rounded-full border mr-2 w-20 h-20"
              />
            </Link>
            <div className="mx-3">
              <div className="flex items-center">
                <div className="font-bold mr-2">{user.nickname}</div>
              </div>
              <div className="flex">
                <p className="mr-3">165cm</p>
                <p>50kg</p>
              </div>
            </div>
            {isFollowingView && (
              <button
                onClick={() => unfollowUser(user.userId)}
                className="flex justify-end text-red-500 ml-2"
              >
                언팔로우
              </button>
            )}
          </article>
        ))}
      </section>
      <div ref={ref}></div>
    </div>
  );
};

export default MyPageFollow;
