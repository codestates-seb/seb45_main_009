import { useState, useEffect } from "react";
import globalAxios from '../../data/data'
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { BsFillBookmarkStarFill } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";


interface ProfileIndProps {
    userId: number;
    isMyFeed: boolean;
    myid: number;
  }

function UserProfile({ userId, isMyFeed , myid }: ProfileIndProps){
    const [isFollowing, setIsFollowing] = useState(false);

    const checkFollowState = async () => {
        try {
            const response = await globalAxios.get(`/follow/following/${myid}`);
            console.log("checkFollow 성공", response.data);
            if (response.data.some((item: any) => item.userId === userId)) {
                setIsFollowing(true);
                console.log("isFollowing 일치", isFollowing)
            } else {
                setIsFollowing(false);
                console.log("isFollowing 불일치", isFollowing)

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
    }, [myid,userId]);

    console.log("팔로잉됨",isFollowing)
    console.log("팔로잉됨",myid,userId )

    type UserResponseType = {
        "nickname": string,
        "profileimg": string,
        "bio": string,
        "height": number,
        "weight": number,
        "feedCount": number,
        "followerCount": number,
        "followCount": number,
        "feedList": {
            feedId: number;
            content: string;
            images: { imageUrl: string }[];
        }[];
        "roles": string[];
        "price": string;
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
    },[userId]);

    console.log("유저 타입?", userResponseType)

    //로딩 상태 - 팔로우 적용 때문에 깜빡거림 방지
    const [isLoading, setIsLoading] = useState(true);
    
    const handleFollow = async () => {
        try {
          const response = await globalAxios.post(`/follow/${userId}`);
          console.log("팔로우 요청 성공", response);
          setIsFollowing(response.data);
        } catch (error: any) {
            console.error("팔로우 요청 실패:", error.response);
            alert(error.response.data.message);
        }
    };

    return(
<div>
    <div className='max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-8 border'>
        <div className="grid md:grid-cols-2">
            <div className="flex items-center">
                <img src={userResponseType?.profileimg} className="mr-2 w-10 h-10 rounded-full" />
                <div className="flex flex-col">
                    <div className=" text-lg flex">
                        {userResponseType?.nickname}
                        {userResponseType?.roles.includes('STORE') && <BsFillBookmarkStarFill className="ml-2 mt-2 text-red-500" />}
                    </div>
                    {(userResponseType?.height || userResponseType?.weight) && (
                        <div className="flex">
                            {userResponseType?.height && (
                                <div className="mr-2.5 font-bold text-gray-400 text-sm">
                                    {userResponseType?.height} cm
                                </div>
                            )}
                            {userResponseType?.weight && (
                                <div className="font-bold text-gray-400 text-sm">
                                    {userResponseType?.weight} kg
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end">
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
        <div className="mt-[40px] flex items-center">
            {userResponseType?.bio && (
                <>
                    <AiFillHeart className="text-gray-400 mx-[10px] text-2xl"/>
                    <div>{userResponseType?.bio}</div>
                </>
            )}
        </div>
        <div className="mt-2 flex items-center">
            {userResponseType?.roles.includes('STORE') && (
                <>
                    <MdAttachMoney  className="text-gray-400 mx-[10px] text-2xl"/>
                    <div>{userResponseType?.price}</div>
                </>
            )}
        </div>
        <div className="my-[40px] flex flex-wrap">
            {userResponseType?.feedList.map((feed, feedIndex) => (
                <div key={feedIndex} className="mb-[10px]">
                {feed.images.map((image, imageIndex) => (
                    <Link key={image.imageUrl} to={`/feeddetailind/${feed.feedId}`}>
                        <img className="mr-[10px] min-w-[229px] w-[13vw] h-[30vh]" key={imageIndex} src={image.imageUrl} alt={`Feed ${feedIndex} Image ${imageIndex}`} />
                    </Link>
                ))}
                </div>
            ))}
        </div>
    </div>
</div>

    )
}

export default UserProfile;