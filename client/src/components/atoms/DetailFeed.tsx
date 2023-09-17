import React, { useState, useEffect, useRef } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import globalAxios from "../../data/data";
import timeFormatter from "../../hooks/timeFormatter";
import { ResponseDataType, UserInfo, RootState } from "../../types/types";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

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
  price: string;
  top: string;
  left: string;
}) {
  // 위아래
  let modalTopPosition = parseInt(top) > 50 ? "-50px" : "25px";
  // 좌우
  const modalLeftPosition = parseInt(left) > 50 ? "-105px" : "25px";

  if (!title) {
    modalTopPosition = "-10px";
  }

  return (
    <div
      style={{ top: modalTopPosition, left: modalLeftPosition }}
      className="absolute w-[100px] rounded-[8px] bg-white text-[12px]  pl-[10px]
      drop-shadow-md transition"
    >
      {title ? <div className="font-bold text-black my-1">{title}</div> : null}
      {size ? <div className="text-gray-400 text-[8px] my-1">{size}</div> : null}
      {price ? <div className="text-[8px] my-1">₩ {price}</div> : null}
      {!title && !size && !price && <div className="text-gray-400 text-[12px] my-1 text-[8px]">태그정보없음</div>}
    </div>
  );
}
//////태그 모달 끝

interface DetailFeedProps {
  feedId: number;
  responseData: ResponseDataType | null;
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

  const [isDragging, setIsDragging] = useState<boolean>(false);
const [startX, setStartX] = useState<number>(0);
const [scrollLeft, setScrollLeft] = useState<number>(0);

const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  const slider = e.currentTarget;
  setIsDragging(true);
  setStartX(e.pageX - slider.offsetLeft);
  setScrollLeft(slider.scrollLeft);
};

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!isDragging) return;
  e.preventDefault();
  const slider = e.currentTarget;
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1;
  slider.scrollLeft = scrollLeft - walk;
};

const handleMouseUp = () => {
  setIsDragging(false);
};

  return (
    <div className="w-full sm:max-w-screen-sm  mx-auto px-4 sm:px-4 lg:px-8">
      {responseData?.images.map((image, index) => (
        <div key={index} className="mb-8 relative">
          <img src={image.imageUrl} alt={`Image ${index}`} className="w-full h-auto" />
          {image.imageTags.map((tag, tagIndex) => {
            const top = Math.round(tag.positionY * 100);
            const left = Math.round(tag.positionX * 100);
            return (
              <div
                key={tagIndex}
                className="w-[20px] h-[20px] rounded-full absolute transition ease-in-out delay-150 text-[#22a1ff]  hover:scale-110 hover:text-[#22a1ff] duration-300 "
                style={{ top: `${top}%`, left: `${left}%` }}
                onMouseEnter={() => setShowTagModal({ photoIndex: index, tagIndex })}
                onMouseLeave={() => setShowTagModal(null)}
              >
                <AiFillPlusCircle className="w-[20px] h-[20px] text-[#22a1ff] transition opacity-50  hover:opacity-100"  />                
                {showTagModal?.photoIndex === index && showTagModal?.tagIndex === tagIndex && (
                  <TagModal
                    title={tag.productName}
                    size={tag.productInfo}
                    price={tag.productPrice.toString()}
                    top={`${top}%`}
                    left={`${left}%`}
                  />
                )}

              </div>
            );
          })}
        </div>
      ))}
      <div className="flex text-sm opacity-50 mb-1 max-mobile:text-[12px]">
        {timeFormatter(responseData?.createdAt)}
      </div>
      <span className="max-mobile:text-[14px]">{responseData?.content}</span>
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
      <div 
        className="mt-2 flex overflow-x-auto scrollbar-thin"
        onMouseDown={handleMouseDown}
     onMouseMove={handleMouseMove}
     onMouseUp={handleMouseUp}
     onMouseLeave={handleMouseUp} 
      >
  {responseData?.images.map((image, imageIndex) =>
    image.imageTags.map((tag, tagIndex) => (
      <div  className="border rounded flex-none mr-4 mb-4 py-2 pl-4 pr-8 text-sm scroll-snap-start scrollbar-hide"
        style={{ 
          minWidth: "",
          overflowY: "auto",
      }} 
      key={`${imageIndex}-${tagIndex}`}
      >
        <div className="flex">
          <div className="flex-none" style={{ width: "60px" }}>
            제품명 :{" "}
          </div>
          <div className="flex-grow font-bold">{tag.productName}</div>
        </div>
        <div className="flex">
          <div className="flex-none" style={{ width: "60px" }}>
            정보 :{" "}
          </div>
          <div>{tag.productInfo}</div>
        </div>
        <div className="flex">
          <div className="flex-none " style={{ width: "60px" }}>
            가격 :{" "}
          </div>
          {
            tag.productPrice 
              ? <div className="text-[#22a1ff]">₩ {tag.productPrice.toString()}</div> 
              : null
          }
        </div>
      </div>
    ))
  )}
</div>
</div>

      

      <div className="flex justify-end ">
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
          <button className="text-[13px] opacity-75" onClick={handleReport}>
            신고
          </button>
        )}
      </div>
    </div>
  );
}

export default DetailFeedInd;
