import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AiFillStar } from "react-icons/ai";
import { IoIosCheckmarkCircle } from "react-icons/io";
import globalAxios from "../../data/data";
import { useSelector } from "react-redux";
import { RootState } from "../../types/types";
import { Link, useLocation } from "react-router-dom";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { BsPeople } from "react-icons/bs";

interface UserData {
  profileimg: string;
  userId: string;
  nickname: string;
  bio: string;
  roles: string;
}

interface MyPageFollowerProps {
  inView: boolean;
}

const MyPageFollower: React.FC<MyPageFollowerProps> = ({ inView }) => {
  const [page, setPage] = useState(0);
  const [followers, setFollowers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const userInfo = useSelector((state: RootState) => state.login.userInfo);

  const getUserData = async () => {
    if (loading || !hasMore) {
      return; // 이미 로딩 중이거나 추가 데이터를 더 이상 불러올 필요가 없는 경우 무시
    }
    try {
      setLoading(true);
      const response = await globalAxios.get(
        `/follow/followers/${userInfo.userId}`,

        { params: { page } }
      );
      const getData = response.data;
      const updatedFollowing = [...followers, ...getData.content];

      setFollowers(updatedFollowing);
      setPage((prev) => prev + 1);

      const currentPages = getData.pageable.pageNumber;
      const totalPages = getData.totalPages;

      setLoading(false);
      if (currentPages >= totalPages) {
        // 현재 페이지가 총 페이지 수보다 크거나 같으면 무한 스크롤 중단
        setHasMore(false);
        // setHasMore(false);
      }
    } catch (err) {}
  };

  useEffect(() => {
    getUserData();
  }, [userInfo]);

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
      const updatedFollowing = followers.filter((user) => user.userId !== userId);
      setFollowers(updatedFollowing);
    } catch (err) {}
  };

  return (
    <div className="flex justify-center flex-col items-center mt-5">
      <section className="grid  grid-cols-1 gap-8 mb-24 mx-3 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4 w-[80%]">
        <div className="flex items-center">
          <BsPeople className="h-10 w-10" />
          <p className="text-2xl font-bold ml-4">팔로워 목록</p>
        </div>
        <span className="col-span-1 lg:col-span-2 2xl:col-span-3"></span>
        <span className="col-span-1 lg:col-span-2 2xl:col-span-3"></span>
        <div className="flex justify-end w-full">
          <div className={`mr-10 cursor-pointer ${"text-blue-500"}`}>팔로워</div>
          <Link to={"/mypage/follow/following"}>
            <div className={`mr-10 cursor-pointer`}>팔로잉</div>
          </Link>
        </div>
        {followers.map((user, idx) => (
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

            <FaXmark
              onClick={() => unfollowUser(user.userId)}
              className="flex justify-end text-red-500 ml-2 hover:cursor-pointer"
            />
          </article>
        ))}
      </section>
    </div>
  );
};

export default MyPageFollower;
