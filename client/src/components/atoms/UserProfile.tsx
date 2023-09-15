import { useState, useRef, useEffect } from "react";
import globalAxios from '../../data/data'
import { FaUser } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";

interface ProfileIndProps {
    feedId: number;
  }

function UserProfile({ feedId }: ProfileIndProps){

    type ResponseType = {
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
    };
        
    const [responseData, setResponseData] = useState<ResponseType | null>(null);
        
    useEffect(() => {
        async function fetcFeedData() {
        try {
            const response = await globalAxios.get(`/profile/${feedId}`);
                if (response.status === 200) {
                  setResponseData(response.data);
                }
            } catch (error) {
            console.error("API 요청 실패:", error);
        }
        }
        fetcFeedData();
        },[feedId]);
    
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

        <div className='max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-8  justify-between '>
        <div className="grid md:grid-cols-2">
            <div className="flex items-center ">
                <img src={responseData?.profileimg} className="mr-2 w-10 h-10 rounded-full " />
                <div className="flex flex-col">
                    <div className="font-bold text-lg">{responseData?.nickname}</div>
                    <div className="flex">
                        <div className="mr-2.5 font-bold text-gray-400 text-sm">{responseData?.height} cm</div>
                        <div className="font-bold text-gray-400 text-sm">{responseData?.weight} kg</div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end ">
                <button onClick={followClick} className="w-full h-[30px] mt-[10px] lg:w-[300px] sm:w-[200px]  rounded-[4px] text-[14px] font-medium bg-btn-color text-white">
                    {isFollowing ? '팔로잉' : '팔로우'}
                </button>
            </div>
        </div>
         <div className="mt-[40px]">
           <div className="flex">
               <FaUser className="text-gray-400 flex-none mr-[10px]" />
               <div className="flex-grow ">{responseData?.bio}</div>
           </div>
           <div className="flex items-center">
               <AiFillHeart className="text-gray-400 mr-[10px] "/>
               <div>{responseData?.bio}</div>
           </div>
         </div>
         <div className="mt-[100px] ">

        <div className="flex flex-wrap">
        {responseData?.feedList.map((feed, feedIndex) => (
            <div key={feedIndex} className="mr-[10px] mb-[20px]">
            {feed.images.map((image, imageIndex) => (
                <img  key={imageIndex} src={image.imageUrl} alt={`Feed ${feedIndex} Image ${imageIndex}`} />
            ))}
            </div>
        ))}
        </div>
        </div>
</div>
</div>



    )
}

export default UserProfile;