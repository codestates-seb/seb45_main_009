import { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import globalAxios from "../../data/data";
import { Link, useNavigate } from "react-router-dom";
import { ResponseDataType } from "../../types/types";
////////////삭제-수정 모달
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
      <button onClick={() => onDelete(feedId)} className="border-b">
        삭제
      </button>
      <Link to={`/feedupdateind/${feedId}`}>
        <button onClick={onEdit}>수정</button>
      </Link>
    </div>
  );
};
///////////삭제-수정 모달 끝

interface ProfileIndProps {
  feedId: number;
  responseData: ResponseDataType | null;
}

function ProfileInd({ feedId, responseData }: ProfileIndProps) {
  const navigate = useNavigate();

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

  const handleDelete = async (feedId: number) => {
    try {
      const response = await globalAxios.delete(`/feed/detail/${feedId}`);
      console.log("글이 성공적으로 삭제되었습니다.", response);
      alert("피드 삭제 완료");
      navigate("/");
    } catch (error) {
      console.error("글 삭제 실패:", error);
    }

    handleCloseModal();
  };

  const handleEdit = () => {
    console.log(feedId);
    handleCloseModal();
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8">
      <div className="grid md:grid-cols-2 gap-4 ">
        <Link to={`/profile/${feedId}`}>
          <div className="flex items-center">
            <img src={responseData?.profileImageUrl} className=" mr-2 w-10 h-10 rounded-full" />
            <div className="flex flex-col">
              <div className="font-bold text-lg ">{responseData?.userNickname}</div>
              <div>{responseData?.content}</div>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-end md:justify-start">
          <button
            className=" mr-4 w-full sm:w-[200px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white"
            onClick={followClick}
          >
            {isFollowing ? "팔로잉" : "팔로우"}
          </button>
          {isModalOpen ? (
            <Modal onClose={handleCloseModal} onDelete={handleDelete} onEdit={handleEdit} feedId={feedId} />
          ) : (
            <button onClick={handleOpenModal}>
              <FaEllipsisH />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProfileInd;
