import { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from 'react-icons/fa';
import globalAxios from '../../data/data'

const Modal = ({ onClose } :any) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // modalRef.current 타입을 never로 
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    }

    // 이벤트 리스너를 문서에 추가
    document.addEventListener("mousedown", handleClickOutside);
    
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [onClose]);

  return(
    <div ref={modalRef} className='flex flex-col border rounded-[4px] w-[100px] 
      absolute  md:right-[60px] right-[100px] md:top-[200px] top-[280px] '>
      <button onClick={onClose} className='border-b'>삭제</button>
      <button onClick={onClose}>수정</button>
    </div>
    )
};


interface ProfileIndProps {
  feedId: number;
}

function ProfileInd({ feedId }: ProfileIndProps) {
  // 모달창
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
    console.log("모달 열기")
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // 팔로우
  const [isFollowing, setIsFollowing] = useState(false);

  const followClick = () => {
    if (isFollowing) {
      console.log('팔로우 취소');
    } else {
      console.log('팔로우하기');
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

return(
<div className='max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8'>
  <div className="grid md:grid-cols-2 gap-4 ">

  <div className="flex items-center">
    <img src={feedUserData?.profileImageUrl} className=" mr-2 w-10 h-10 rounded-full" />
    <div className="flex flex-col">
      <div className="font-bold text-lg ">{feedUserData?.userNickname}</div>
      <div>{feedUserData?.content}</div>
    </div>
  </div>

  <div className="flex items-center justify-end md:justify-start">
    <button className=" mr-4 w-full sm:w-[200px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white" onClick={followClick}>
      {isFollowing ? '팔로잉' : '팔로우'} 
    </button>
    <button onClick={handleOpenModal}  className='relative'><FaEllipsisH /></button>
    {isModalOpen && <Modal onClose={handleCloseModal} /> }
  </div>

  </div>
</div>
) 
}
export default ProfileInd;