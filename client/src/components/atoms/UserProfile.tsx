import { useState, useEffect } from "react";
import globalAxios from "../../data/data";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { BiSolidUser } from "react-icons/bi";
import nofeedimg from '../../assets/images/nofeed.png'

interface ProfileIndProps {
  userId: number;
  isMyFeed: boolean;
  myid: number;
}

function UserProfile({ userId, isMyFeed , myid }: ProfileIndProps){
    const sport = ["헬스, 런닝"];

    const [isFollowing, setIsFollowing] = useState(false);

  const checkFollowState = async () => {
    try {
      const response = await globalAxios.get(`/follow/following/${myid}`);
      console.log("checkFollow 성공", response.data);
      if (response.data.some((item: any) => item.userId === userId)) {
        setIsFollowing(true);
        console.log("isFollowing 일치", isFollowing);
      } else {
        setIsFollowing(false);
        console.log("isFollowing 불일치", isFollowing);
      }
    } catch (error) {
      console.log("checkFollow 실패 error:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 80);
    }
  };

  useEffect(() => {
    checkFollowState();
  }, [myid, userId]);

  console.log("팔로잉됨", isFollowing);
  console.log("팔로잉됨", myid, userId);

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
  const [userResponseType, setUserResponseType] =
    useState<UserResponseType | null>(null);
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

  console.log("유저 타입?", userResponseType);

  //로딩 상태 - 팔로우 적용 때문에 깜빡거림 방지
  const [isLoading, setIsLoading] = useState(true);

  const handleFollow = async () => {
    try {
      const response = await globalAxios.post(`/follow/${userId}`);
      console.log("팔로우 요청 성공", response);
      setIsFollowing(response.data);

      if (!isFollowing) {
        const notificationResponse = await globalAxios.post(`/notifications`, {
          recipientUserId: userId,
          message: `팔로우 알림: ${myid}님이 팔로우하셨습니다.`,
        });
      }
    } catch (error: any) {
      console.error("팔로우 요청 실패:", error.response);
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <div className="max-w-screen-xl md:max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-8">
        <div className="grid md:grid-cols-2">
          <div className="flex items-center justify-center sm:justify-start">
            <img
              src={userResponseType?.profileimg}
              className="mr-6 sm:mr-2 w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <div className=" text-lg flex ">
                {userResponseType?.nickname}
                {userResponseType?.roles.includes("STORE") && (
                  <BsFillBookmarkStarFill className="ml-2 mt-2 text-red-500" />
                )}
              </div>
              {(userResponseType?.height || userResponseType?.weight) && (
                <div className="flex">
                  {userResponseType?.height && (
                    <div className="mr-2.5 font-bold text-gray-400 text-sm">
                      {userResponseType?.height} cm
                    </div>
                  )}
                  {userResponseType?.weight && (
                    <div className="font-bold text-gray-400 text-sm ">
                      {userResponseType?.weight} kg
                    </div>
                    <div className="opacity-60 text-[13px] max-mobile:text-[12px]">
                    {userResponseType?.bio ? 
                        userResponseType?.bio : 
                        <span className="text-gray-400">__빈값__</span>
                    }
                    </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center sm:justify-end mt-6  sm:mr-4">
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
        <div className="mt-[40px] flex items-center justify-center sm:justify-start ">
                <>
                {/* 개인이면 sport, 기업이면 위치 가져오기 */}
                    <AiFillHeart className="text-gray-400 mx-[10px] text-2xl"/>
                    <div>{sport}</div>
                </>
        </div>
        <div className="mt-2 flex items-center justify-center sm:justify-start ">
            {
                userResponseType?.roles.includes('USER') && (
                    <>
                        <BiSolidUser  className="text-gray-400 mx-[10px] text-2xl"/>
                        <div>{userResponseType?.height ?
                                userResponseType?.height :
                                <span className="text-gray-400">__</span>} cm</div>
                        <div className="ml-[14px]">
                            {userResponseType?.weight ?
                                userResponseType?.weight :
                                <span className="text-gray-400">_</span>} kg</div>
                    </>
                )
            }
        </div>
        <div className="mt-2 flex items-center justify-center sm:justify-start ">
          {userResponseType?.roles.includes("STORE") && (
            <>
              <MdAttachMoney className="text-gray-400 mx-[10px] text-2xl" />
              <div>{userResponseType?.price}</div>
            </>
          )}
        </div>

        {/* 선 추가 */}
        <div className="my-[60px]  text-gray relative opacity-60 text-[13px] border-x flex justify-center">피드 리스트</div>

        <div className="my-[40px] flex flex-wrap justify-center sm:justify-start ">
        { 
        userResponseType?.feedList && userResponseType.feedList.length > 0 ? (
            userResponseType.feedList.map((feed, feedIndex) => (
            <div key={feedIndex} className="mb-[10px]">
                {feed.images[0] && (  // 첫 번째 이미지만 보여주도록 수정
                    <Link key={feed.images[0].imageUrl} to={`/feeddetailind/${feed.feedId}`}>
                        <img className="mr-[10px] min-w-[229px] w-[13vw] h-[30vh]" src={feed.images[0].imageUrl} alt={`Feed ${feedIndex} Image 0`} />
                    </Link>
                )}
            </div>
            ))
        ) : (
            <img src={nofeedimg} alt="No feeds available" />
        )
    }
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
