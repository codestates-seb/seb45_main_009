import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import globalAxios from "../../data/data";
import { useSelector } from "react-redux";
import { RootState } from "../../types/types";
import { Link } from "react-router-dom";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";
import loadingimg from "../../assets/images/loading.gif";
interface UserData {
  profileimg: string;
  userId: string;
  nickname: string;
  bio: string;
  roles: string;
}

const MyPageFollow = () => {
  const [page, setPage] = useState(1);
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [following, setFollowing] = useState<UserData[]>([]);
  const [isFollowingView, setIsFollowingView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [ref, inView] = useInView();

  const userInfo = useSelector((state: RootState) => state.login.userInfo);

  const PAGE_SIZE = 4;

  const chunkData = isFollowingView ? following : followers;

  const toggleFollowingView = (view: boolean) => {
    setIsFollowingView(view);
  };

  const isFollow = isFollowingView ? "following" : "followers";
  const getUserData = async () => {
    if (loading || !hasMore) {
      return; // 이미 로딩 중이거나 추가 데이터를 더 이상 불러올 필요가 없는 경우 무시
    }
    try {
      setLoading(true);
      const response = await globalAxios.get(
        `/follow/${isFollow}/${userInfo.userId}`,
        { params: { page, pageSize: PAGE_SIZE } }
      );
      const getData = response.data;
      setPage((prevPage) => prevPage + 1);
      if (isFollowingView) {
        setFollowing(getData);
        console.log(getData);
      } else {
        setFollowers(getData);
      }

      // const currentPages = getData.pageInfo.page;
      // const totalPages = getData.pageInfo.totalPages;

      setLoading(false);
      // if (currentPages >= totalPages) {
      //   // 현재 페이지가 총 페이지 수보다 크거나 같으면 무한 스크롤 중단
      //   setHasMore(false);
      // }
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  useEffect(() => {
    getUserData();
  }, [isFollowingView, userInfo]);

  useEffect(() => {
    if (inView) {
      getUserData();
    }
  }, [inView]);

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
      <section className="grid  grid-cols-1 gap-8 h-full mb-24 mx-3 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4 w-[80%]">
        <div className="flex items-center">
          <BsPeople className="h-10 w-10" />
          <p className="text-2xl font-bold ml-4">
            {isFollowingView ? "팔로잉 목록" : "팔로워 목록"}
          </p>
        </div>
        <span className="col-span-1 lg:col-span-2 2xl:col-span-3"></span>
        <span className="col-span-1 lg:col-span-2 2xl:col-span-3"></span>
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

        {!loading ? (
          (isFollowingView ? following : followers).map((user, idx) => (
            <article key={idx} className="flex items-center">
              <Link to={`/profile/${user.userId}`}>
                <img
                  src={user.profileimg}
                  alt="profile"
                  className="rounded-full border mr-2 w-[15vw] h-[15vw]  xl:h-[4vw] max-w-[3.2rem] max-h-[3.2rem]"
                />
              </Link>
              <div className="mx-3 ">
                <div className="flex  flex-col items-start ">
                  <div className="font-bold w-[40vw] sm:w-[18vw] md:w-[21vw] lg:w-[12vw] 2xl:w-[10vw] mr-2 truncate">
                    {user.nickname}
                  </div>
                  <p className=" w-[40vw] sm:w-[18vw] md:w-[21vw] lg:w-[12vw]  2xl:w-[10vw] truncate ">
                    {user.bio ? user.bio : "오늘의 주인공"}
                  </p>
                </div>
              </div>

              {user.roles[0] === "STORE" && (
                <div>
                  <BsFillBookmarkStarFill color="red" />
                </div>
              )}

              {isFollowingView && (
                <FaXmark
                  onClick={() => unfollowUser(user.userId)}
                  className="flex justify-end text-red-500 ml-2 hover:cursor-pointer"
                />
              )}
            </article>
          ))
        ) : (
          <img src={loadingimg} alt="loading" />
        )}
      </section>
      <div ref={ref} className="w-1 h-1"></div>
    </div>
  );
};

export default MyPageFollow;
