import { useState, useEffect } from "react";
import globalAxios from '../../data/data'
import { MdOutlineAttachMoney } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { BsBookmarkStarFill } from "react-icons/bs";
import { Link } from "react-router-dom";


interface ProfilePageCor {
    userId: number;
  }

function UserProfileCor({ userId }: ProfilePageCor){
    type ResponseType = {
        "nickname": string,
        "profileimg": string,
        "bio": string,
        "height": number,
        "weight": number,
        "feedCount": number,
        "followerCount": number,
        "followCount": number,
        "price" : string,
        "feedList": {
            feedId: number;
            content: string;
            images: { imageUrl: string }[];
        }[];
    };
        
    const [responseData, setResponseData] = useState<ResponseType | null>(null);
        
    useEffect(() => {
        async function fetcFeedData() {
        try {
            const response = await globalAxios.get(`/profile/${userId}`);
                if (response.status === 200) {
                  setResponseData(response.data);
                }
            } catch (error) {
            console.error("API 요청 실패:", error);
        }
        }
        fetcFeedData();
        },[userId]);

        console.log("해당 유저 아이디", userId)
        console.log("해당 유저 정보", responseData)

        const [isFollowing, setIsFollowing] = useState(false);

    const followClick = () => {
      if (isFollowing) {
        console.log('팔로우 취소');
      } else {
        console.log('팔로우하기');
      }
      setIsFollowing(!isFollowing);
    };

    return(
<div>
    <div className='max-w-screen-lg mx-auto px-4 lg:px-8'>
        <div className="grid md:grid-cols-2">
            <div className="flex items-center">
                <img src={responseData?.profileimg} className="mr-2 w-10 h-10 rounded-full" />
                <div className="flex items-center">
                    <div className="font-bold text-xl mx-4">{responseData?.nickname}</div>
                    <div className="text-btn-color"><BsBookmarkStarFill /></div>
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={followClick} className="mt-2.5 w-full sm:w-[300px] rounded-1 text-[14px] bg-btn-color text-white">
                    {isFollowing ? '팔로잉' : '팔로우'}
                </button>
            </div>
        </div>
        <div className="mt-[40px]">
            <div className="flex items-center">
                <AiFillHeart className="text-gray-400 mx-2.5 text-2xl" />
                <div>{responseData?.bio}</div>
            </div>
            <div className="flex items-center mt-1.5">
                <MdOutlineAttachMoney className="text-gray-400 mx-2.5 text-2xl"/>
                <div>{responseData?.price}</div>
            </div>
        </div>
        <div className="my-[100px] flex flex-wrap">
            {responseData?.feedList.map((feed, feedIndex) => (
                <div key={feedIndex} className="mb-2.5">
                    {feed.images.map((image, imageIndex) => (
                        <Link to={`/feeddetailind/${feed.feedId}`}>
                            <img className="mr-2.5 min-w-[229px] w-[13vw] h-[30vh]" key={imageIndex} src={image.imageUrl} alt={`Feed ${feedIndex} Image ${imageIndex}`} />
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    </div>
</div>

    )
}
    

export default UserProfileCor;