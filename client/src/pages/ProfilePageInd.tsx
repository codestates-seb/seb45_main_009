import BackButton from "../components/atoms/BackButton";
import { useState, useRef, useEffect } from "react";
import globalAxios from '../data/data'
import { FaUser } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import UserProfile from '../components/atoms/UserProfile';


function ProfilePageInd() {
  const { feedId: feedIdString } = useParams<{ feedId: string }>();

  const feedId = Number(feedIdString) || 0;

  if (!feedId) {
    return <div>Invalid feedId</div>;
  }

  return (
    <div>
      <BackButton />
      <UserProfile  feedId={feedId}/>
    </div>
  );
}

// function Profile({ feedId }: ProfileProps) {
//   type ResponseType = {
//     "nickname": string,
//     "profileimg": string,
//     "bio": string,
//     "height": number,
//     "weight": number,
//     "feedCount": number,
//     "followerCount": number,
//     "followCount": number,
//     "feedList": string[]
//   };

//   const [responseData, setResponseData] = useState<ResponseType | null>(null);

//   useEffect(() => {
//     async function fetcFeedData() {
//       try {
//         const response = await globalAxios.get(`/profile/${feedId}`);
//         if (response.status === 200) {
//           setResponseData(response.data);
//         }
//       } catch (error) {
//         console.error("API 요청 실패:", error);
//       }
//     }
//     fetcFeedData();
//   },[feedId]);

//     const [isFollowing, setIsFollowing] = useState(false);

//     const followClick = () => {
//       if (isFollowing) {
//         console.log('팔로우 취소');
//       } else {
//         console.log('팔로우하기');
//       }
//       setIsFollowing(!isFollowing);
//     };

//   return (
//     <div className="w-[1100px] ml-[100px] ">
//       <BackButton />

//       <div className='max-w-screen-md mx-auto px-4 sm:px-4 lg:px-8 border'>
//         <div className="grid md:grid-cols-2 gap-4 ">
//           <div className="flex items-center">
//             <img src={responseData?.profileimg} className=" mr-2 w-10 h-10 rounded-full border" />
//             <div className="flex flex-col">
//               <div className="font-bold text-lg ">{responseData?.nickname}</div>
//               <div className="flex">
//                 <div className="mr-[10px] font-bold text-gray-400 text-sm">{responseData?.height} cm</div>
//                 <div className="font-bold text-gray-400 text-sm">{responseData?.weight} kg</div>
//               </div>
//             </div>
//         </div>
//         <button onClick={followClick} className="w-full w-[200px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white">
//         {isFollowing ? '팔로잉' : '팔로우'} 
//         </button>
//         </div>
//         <div className="mt-[40px]">
//           <div className="flex items-center">
//               <FaUser className="text-gray-400 flex-none mr-[10px]" />
//               <div className="flex-grow ">{responseData?.bio}</div>
//           </div>
//           <div className="flex items-center">
//               <AiFillHeart className="text-gray-400 mr-[10px] "/>
//               <div>{responseData?.bio}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default ProfilePageInd;
