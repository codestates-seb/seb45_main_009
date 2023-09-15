import { useState, useRef, useEffect } from "react";
import { FaEllipsisH } from "react-icons/fa";
import globalAxios from "../../data/data";
import { Link, useNavigate } from "react-router-dom";
import { ResponseDataType } from "../../types/types";
import UpdateDeleteModal from "../features/UpdateDeleteModal";
import ModalBackDrop from "../features/ModalBackDrop";

interface ProfileIndProps {
  feedId: number;
  responseData: ResponseDataType | null;
}

function ProfileInd({ feedId, responseData }: ProfileIndProps) {
  const navigate = useNavigate();

  // 모달창
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log("모달 열기");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 팔로우
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    try {
      const response = await globalAxios.post(`/follow/${responseData?.userId}`);
      console.log("팔로우 요청 성공", response);
      setIsFollowing(response.data);
    } catch (error: any) {
      console.error("팔로우 요청 실패:", error.response);
      alert(error.response.data.message);
    }
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

  const handleBackClick = () => {
    console.log("모달닫기");
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div className="max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8">
      <div className="grid md:grid-cols-2 gap-4 ">
        <Link to={`/profile/${responseData?.userId}`}>
          <div className="flex items-center">
            <img src={responseData?.profileImageUrl} className=" mr-2 w-10 h-10 rounded-full" alt="profileImage" />
            <div className="flex flex-col">
              <div className="font-bold text-lg ">{responseData?.userNickname}</div>
              <div>{responseData?.bio}</div>
            </div>
          </div>
        </Link>

        <div className="flex items-center justify-end md:justify-start">
          <div className="flex flex-row">
            <button
              className=" mr-4 w-full sm:w-[200px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white"
              onClick={handleFollow}
            >
              {isFollowing ? "팔로잉" : "팔로우"}
            </button>
            <div className="relative">
              {isModalOpen ? (
                <>
                  <div
                    className={`fixed top-0 left-0 w-full h-full z-100 flex justify-center items-center`}
                    onClick={handleBackClick}
                  ></div>
                  <UpdateDeleteModal onDelete={handleDelete} onEdit={handleEdit} feedId={feedId} className="absolute" />
                </>
              ) : null}
              <button onClick={handleOpenModal}>
                <FaEllipsisH className="relative z-10" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileInd;
