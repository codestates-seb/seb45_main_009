import { useState, useEffect } from "react";
import globalAxios from "../../data/data";
import { Link, useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ResponseDataType } from "../../types/types";
import { UserInfo } from "../../types/types";

interface ProfileIndProps {
  feedId: number;
  responseData: ResponseDataType | null;
  userInfo: UserInfo;
  isMyFeed: boolean;
}

function ProfileInd({ feedId, responseData, userInfo, isMyFeed }: ProfileIndProps) {
  const navigate = useNavigate();

  //로딩 상태 - 팔로우 적용 때문에 깜빡거림 방지
  const [isLoading, setIsLoading] = useState(true);
  // 팔로우
  const [isFollowing, setIsFollowing] = useState(false);

  const followClick = () => {
    if (isFollowing) {
      console.log("팔로우 취소");
    } else {
      console.log("팔로우하기");
    }
    // 팔로우 상태 토글
    setIsFollowing(!isFollowing);
  };

  type ResponseDataType = {
    feedId: number;
    userId: number;
    userNickname: string;
    profileImageUrl: string;
    content: string;
    relatedTags: string[];
    images: Array<{
      imageId: number;
      imageUrl: string;
      imageTags: any[];
    }>;
  };


  const handleNavigateProfile = () => {
    navigate(`/profile/${responseData?.userId}`);
  };

  const checkFollowState = async () => {
    try {
      const response = await globalAxios.get(`/follow/following/${userInfo.userId}`);
      console.log("checkFollow 성공", response.data);
      if (response.data.some((item: any) => item.userId === responseData?.userId)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
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
  }, [userInfo, responseData]);
  return (
    <div className="max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8">
      <div className="flex flex-row justify-between">
        <Link to={`/profile/${feedUserData?.userId}`}>
        <div className="flex items-center">
          <img
            src={responseData?.profileImageUrl}
            className=" mr-2 w-10 h-10 rounded-full hover:cursor-pointer"
            alt="profileImage"
            onClick={handleNavigateProfile}
          />
          <div className="flex flex-col">
            <span className="text-lg hover:cursor-pointer" onClick={handleNavigateProfile}>
              {responseData?.nickname}
            </span>
            <span className="opacity-60 text-[13px] max-mobile:text-[12px]">{responseData?.bio}</span>
          </div>
        </div>
          </ Link>
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
  </div>
  </Link>

  <div className="flex items-center justify-end md:justify-start">
    <button className=" mr-4 w-full sm:w-[200px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white" onClick={followClick}>
      {isFollowing ? '팔로잉' : '팔로우'} 
    </button>
    {
            isModalOpen ? 
            <Modal onClose={handleCloseModal} onDelete={handleDelete} onEdit={handleEdit}/> :
            <button onClick={handleOpenModal}><FaEllipsisH /></button>
          }
  </div>

  </div>
</div>
) 
}
export default ProfileInd;
