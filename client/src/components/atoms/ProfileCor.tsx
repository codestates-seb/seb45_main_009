import { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import globalAxios from "../../data/data";
import { Link, useNavigate } from "react-router-dom";

const Modal = ({ onClose, onDelete, onEdit, feedId }: any) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={modalRef} className="flex flex-col border rounded-[4px] w-[100px]">
      <button onClick={onDelete} className="border-b">
        삭제
      </button>
      <Link to={`/feedupdateind/${feedId}`}>
        <button onClick={onEdit}>수정</button>
      </Link>
    </div>
  );
};

interface ProfileCorProps {
  feedId: number;
}

function ProfileCor({ feedId }: ProfileCorProps) {
  // 모달창
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
    console.log("모달 열기");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

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

  const [feedUserData, setFeedUserData] = useState<ResponseDataType | null>(null);

  useEffect(() => {
    async function fetcFeedData() {
      try {
        const response = await globalAxios.get(`/feed/detail/${feedId}`);
        if (response.status === 200) {
          setFeedUserData(response.data);
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }
    fetcFeedData();
  }, []);

  console.log("피드 유저 데터",feedUserData)

  const handleDelete = async (feedId:number) => {
    try {
      const response = await globalAxios.delete(`/feed/detail/${feedId}`);

      if (response.status === 200) {
        console.log("글이 성공적으로 삭제되었습니다.");
      }
    } catch (error) {
      console.error("글 삭제 실패:", error);
    }

    handleCloseModal();
  };

  const handleEdit = () => {
    console.log(feedId);
    handleCloseModal();
  };

return(
<div className='max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8'>
  <div className="grid md:grid-cols-2 gap-4 ">

  <Link to={`/profile/${feedId}`} >
  <div className="flex items-center">
    <img src={feedUserData?.profileImageUrl} className=" mr-2 w-10 h-10 rounded-full" />
    <div className="flex flex-col">
      <div className="font-bold text-lg ">{feedUserData?.userNickname}</div>
      <div>{feedUserData?.content}</div>
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
export default ProfileCor;
