import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiAlarmWarningFill } from "react-icons/ri";
import { AiFillPlusCircle } from "react-icons/ai";
import globalAxios from "../../data/data";
import { ResponseDataType, UserInfo, RootState } from "../../types/types";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { LuSiren } from "react-icons/lu";
//////태그 모달 시작
function TagModal({
  title,
  size,
  price,
  top,
  left,
}: {
  title: string;
  size: string;
  price: number;
  top: string;
  left: string;
}) {
  // 위아래
  const modalTopPosition = parseInt(top) > 50 ? "-60px" : "25px";
  // 좌우
  const modalLeftPosition = parseInt(left) > 50 ? "-105px" : "25px";

  return (
    <div
      style={{ top: modalTopPosition, left: modalLeftPosition }}
      className="absolute border w-[100px] rounded-[2px] bg-white text-[12px] mt-[2px] pl-[10px]"
    >
      <div>{title}</div>
      <div className="text-gray-400 text-[8px]">{size}</div>
      <div className="font-bold">₩{price}</div>
    </div>
  );
}
//////태그 모달 끝

interface DetailFeedProps {
  feedId: number;
  responseData: ResponseDataType | null;
  setIsMyFeed: React.Dispatch<React.SetStateAction<boolean>>;
  isMyFeed: boolean;
  userInfo: UserInfo;
}
function DetailFeedInd({ feedId, responseData, isMyFeed }: DetailFeedProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.login.userInfo);
  // 좋아요
  const [isLiked, setIsLiked] = useState<boolean>(false);
  //좋아요 리스트
  const [likeList, setLikeList] = useState<number[]>([]);

  const handleLikeClick = async () => {
    console.log("게시물 좋아요");
    try {
      const response = await globalAxios.post(`/feed/detail/${feedId}/like`);
      console.log("좋아요 성공:", response);
      getLikeList();
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  const getLikeList = async () => {
    try {
      const response = await globalAxios.get(`/feed/detail/${feedId}/likeduser`);
      console.log("좋아요 리스트 get요청 성공", response.data);
      setLikeList(response.data);
      if (response.data.includes(userInfo.userId)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.log("좋아요 리스트 get실패", error);
    }
  };

  //좋아요 리스트 get요청
  useEffect(() => {
    getLikeList();
  }, []);

  const handleReport = async () => {
    try {
      const response = await globalAxios.post(`/feed/detail/${feedId}/report`, {
        reason: "일단 내용은 하드코딩으로",
      });
      console.log("신고 성공", response);
      alert("신고가 완료되었습니다");
    } catch (error: any) {
      console.log("신고 실패", error.response.data);
      alert(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await globalAxios.delete(`/feed/detail/${feedId}`);
      console.log("글이 성공적으로 삭제되었습니다.", response);
      alert("피드 삭제 완료");
      navigate("/");
    } catch (error) {
      console.error("글 삭제 실패:", error);
    }
  };
  const handleUpdate = () => {
    navigate(`/feedupdateind/${feedId}`);
  };
  // 정보 태그 모달창
  const [showTagModal, setShowTagModal] = useState<{
    photoIndex: number;
    tagIndex: number;
  } | null>(null);

  function formatRelativeTime(dateString: any): string {
    const now = new Date(new Date().getTime() - 9 * 60 * 60 * 1000); // 9시간 빼기/utc-한국차이
    const inputDate = new Date(dateString);

    const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 1) return `${years} years ago`;
    if (years === 1) return "1 year ago";

    if (months > 1) return `${months} months ago`;
    if (months === 1) return "1 month ago";

    if (days > 1) return `${days} days ago`;
    if (days === 1) return "1 day ago";

    if (hours > 1) return `${hours} hours ago`;
    if (hours === 1) return "1 hour ago";

    if (minutes > 1) return `${minutes} minutes ago`;

    return "1 minute ago";
  }

  return (
    <div className="w-full sm:max-w-screen-sm  mx-auto px-4 sm:px-4 lg:px-8">
      {responseData?.images.map((image, index) => (
        <div key={index} className="mb-2 relative">
          <img src={image.imageUrl} alt={`Image ${index}`} className="w-full h-auto" />
          {image.imageTags.map((tag, tagIndex) => {
            const top = Math.round(tag.positionY * 100);
            const left = Math.round(tag.positionX * 100);
            return (
              <div
                key={tagIndex}
                className="w-[20px] h-[20px] rounded-full absolute"
                style={{ top: `${top}%`, left: `${left}%` }}
                onMouseEnter={() => setShowTagModal({ photoIndex: index, tagIndex })}
                onMouseLeave={() => setShowTagModal(null)}
              >
                <AiFillPlusCircle className="w-[20px] h-[20px] text-tag-btn-color" />
                {/* 만약 div위에 마우스 올린게 이미지index와 태그 index가 맞으면 모달창 보여주기 */}
                {showTagModal?.photoIndex === index && showTagModal?.tagIndex === tagIndex && (
                  <TagModal
                    title={tag.productName}
                    size={tag.productInfo}
                    price={parseInt(tag.productPrice)}
                    top={`${top}%`}
                    left={`${left}%`}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex text-sm opacity-50 mb-1">{formatRelativeTime(responseData?.createdAt)}</div>
      <div className="flex flex-row">
        {/* <span className="mr-2 font-medium">{responseData?.nickname}</span> */}
        <span>{responseData?.content}</span>
      </div>
      <div className="flex flex-row items-center mt-[20px]">
        {isLiked === false ? (
          <AiOutlineHeart className="cursor-pointer text-red-400" onClick={handleLikeClick} size={20} />
        ) : (
          <AiFillHeart className="cursor-pointer text-red-400" onClick={handleLikeClick} size={20} />
        )}
        <div className="ml-2 pb-[2px]">{likeList.length}</div>
      </div>
      <div className=" mt-2">
        <div className="font-bold text-gray-400 text-sm mb-[10px]"></div>
        <ul>
          {responseData?.relatedTags.map((tag, index) => (
            <li
              className="inline-block px-2 py-1 border-bdc rounded mr-2.5 mb-2.5 transition bg-[#edf7ff] text-[#22a1ff] text-[13px]"
              key={index}
            >
              {`#${tag}`}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex flex-wrap">
          {responseData?.images.map((image, imageIndex) =>
            image.imageTags.map((tag, tagIndex) => (
              <div className="border rounded flex-grow mr-4 mb-4 p-2 text-sm" key={`${imageIndex}-${tagIndex}`}>
                <div className="flex">
                  <div className="flex-none" style={{ width: "70px" }}>
                    제품명 :{" "}
                  </div>
                  <div className="flex-grow font-bold">{tag.productName}</div>
                </div>
                <div className="flex">
                  <div className="flex-none " style={{ width: "70px" }}>
                    가격 :{" "}
                  </div>
                  <div>₩ {parseInt(tag.productPrice)}</div>
                </div>
                <div className="flex">
                  <div className="flex-none" style={{ width: "70px" }}>
                    추가정보 :{" "}
                  </div>
                  <div className="text-btn-color">{tag.productInfo}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        {isMyFeed ? (
          <>
            <button className="m-2 text-[13px] opacity-75" onClick={handleUpdate}>
              수정
            </button>
            <button className="text-[13px] opacity-75" onClick={handleDelete}>
              삭제
            </button>
          </>
        ) : (
          <div onClick={handleReport} className="flex flex-row items-center hover:cursor-pointer  opacity-75">
            <LuSiren className="" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailFeedInd;
