import { useState, useEffect } from "react";
import globalAxios from "../../data/data";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { HiLocationMarker } from "react-icons/hi";
import { MdAttachMoney } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import nofeedimg from "../../assets/images/nofeed.png";
import { RootState, RootStates } from "../../types/types";
import { useSelector } from "react-redux";

interface ProfileIndProps {
  userId: number;
  isMyFeed: boolean;
  myid: number;
}

function UserProfile({ userId, isMyFeed, myid }: ProfileIndProps) {
  // 유저 sport 가져오기
  const { allUserDatas } = useSelector((state: RootStates) => state.feed);
  const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
  // 전체 유저에서 프로필 유저 확인
  const isUserId = allUserDatas.some((user) => user.userId === userId);

  // 사진 가져오기
  let userSport = "";
  let userlocation = "";

  if (isUserId) {
    const matchedUser = allUserDatas.find((user) => user.userId === userId);
    if (matchedUser && matchedUser.sport) {
      userSport = matchedUser.sport;
      userlocation = matchedUser.location;
    }
  }

  const [isFollowing, setIsFollowing] = useState(false);

  const checkFollowState = async () => {
    if (isAuthenticated === false) return;
    try {
      const response = await globalAxios.get(`/follow/following/${myid}`);
      if (response.data.some((item: any) => item.userId === userId)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 80);
    }
  };

  useEffect(() => {
    checkFollowState();
  }, [myid, userId]);

  type UserResponseType = {
    nickname: string;
    profileimg: string;
    bio: string;
    height: number;
    weight: number;
    feedCount: number;
    followerCount: number;
    followCount: number;
    feedList: {
      feedId: number;
      content: string;
      images: { imageUrl: string }[];
    }[];
    roles: string[];
    price: string;
  };
  const [userResponseType, setUserResponseType] = useState<UserResponseType | null>(null);
  useEffect(() => {
    async function fetcFeedData() {
      try {
        const response = await globalAxios.get(`/profile/${userId}`);
        if (response.status === 200) {
          setUserResponseType(response.data);
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }
    fetcFeedData();
  }, [userId]);

  //로딩 상태 - 팔로우 적용 때문에 깜빡거림 방지
  const [isLoading, setIsLoading] = useState(true);

  const handleFollow = async () => {
    if (isAuthenticated === false) return;
    try {
      const response = await globalAxios.post(`/follow/${userId}`);
      setIsFollowing(response.data);

      // if (!isFollowing) {
      //   const notificationResponse = await globalAxios.post(`/notifications`, {
      //     recipientUserId: userId,
      //     message: `팔로우 알림: ${myid}님이 팔로우하셨습니다.`,
      //   });
      // }
    } catch (error: any) {
      console.error("팔로우 요청 실패:", error.response);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex  justify-center">
      <div className="max-w-screen-lg md:max-w-screen-xl mx-auto px-4 sm:px-4 lg:mx-[40px] ">
        <div className="grid md:grid-cols-2  sm:px-[50px]">
          <div className="flex items-center justify-center sm:justify-start">
            <img src={userResponseType?.profileimg} className="mr-6 sm:mr-2 w-10 h-10 rounded-full" alt="img" />
            <div className="flex flex-col ">
              <div className=" text-lg flex ">
                {userResponseType?.nickname}
                {userResponseType?.roles.includes("STORE") && (
                  <BsFillBookmarkStarFill className="ml-2 mt-2 text-red-500" />
                )}
              </div>
              <div className="text-sm text-gray-400">
                {userResponseType?.bio ? userResponseType?.bio : <span className="text-gray-400">오늘의 주인공</span>}
              </div>
            </div>
          </div>
          <div className="flex justify-center sm:justify-end mt-6  sm:mr-4  ">
            {isMyFeed ? null : (
              <div className="flex items-center justify-end">
                <button
                  className={`whitespace-nowrap ml-2 rounded-[6px] text-[14px] 
            py-1.5 px-6 hover: font-medium transition  
            ${
              isFollowing
                ? "text-[#000000] bg-[#efefef] hover:bg-[#dbdbdb]"
                : "bg-[#0095f6] hover:bg-[#1877f2] text-white "
            }`}
                  onClick={handleFollow}
                  style={{ opacity: isLoading ? 0 : 1 }}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-[60px] flex items-center justify-center sm:justify-start sm:px-[50px]">
          <div className="flex">
            <AiFillHeart className="text-gray-400 mx-[10px] text-2xl" />
            <div>{userSport ? userSport : <span className="text-gray-400"> - </span>}</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center sm:justify-start sm:px-[50px]">
          {userResponseType?.roles.includes("USER") && (
            <>
              <BiSolidUser className="text-gray-400 mx-[10px] text-2xl" />
              <div>
                {userResponseType?.height ? userResponseType?.height : <span className="text-gray-400">- </span>}
                cm
              </div>
              <div className="ml-[14px]">
                {userResponseType?.weight ? userResponseType?.weight : <span className="text-gray-400">- </span>}
                kg
              </div>
            </>
          )}
        </div>
        <div className="mt-2 flex items-center justify-center sm:justify-start sm:px-[50px]">
          {userResponseType?.roles.includes("STORE") && (
            <div className="flex">
              <HiLocationMarker className="text-gray-400 mx-[10px] text-2xl" />
              <div>{userlocation}</div>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center justify-center sm:justify-start sm:px-[50px]">
          {userResponseType?.roles.includes("STORE") && (
            <div className="flex">
              <MdAttachMoney className="text-gray-400 mx-[10px] text-2xl" />
              <div>{userResponseType?.price}</div>
            </div>
          )}
        </div>

        {/* 선 추가 */}
        <div className=" h-[20px] mt-2 text-[#eee] sm:px-[40px] mb-1">
          <div className="text-gray-400 text-[12px] flex justify-center">피드 리스트</div>
          <div className="border-b text-black w-[90%] "></div>
        </div>

        <div className="my-[40px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userResponseType?.feedList && userResponseType.feedList.length > 0 ? (
            userResponseType.feedList.map((feed, feedIndex) => (
              <div
                key={feedIndex}
                className="mb-[10px] mx-[10px] hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-[5px_5px_10px_rgba(0,0,0,0.2)]"
              >
                {feed.images[0] && (
                  <Link key={feed.images[0].imageUrl} to={`/feeddetailind/${feed.feedId}`}>
                    <img
                      className=" min-w-[250px] min-h-[250px] w-[15vw] h-[15vw]"
                      src={feed.images[0].imageUrl}
                      alt={`Feed ${feedIndex} Images`}
                    />
                  </Link>
                )}
              </div>
            ))
          ) : (
            <img src={nofeedimg} alt="No feeds available" />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
