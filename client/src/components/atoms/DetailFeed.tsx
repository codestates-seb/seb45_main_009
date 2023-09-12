import { useState, useRef, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiAlarmWarningFill } from "react-icons/ri";
import { AiFillPlusCircle } from "react-icons/ai";
import React from "react";

function TagModal({
  title,
  size,
  price,
  top,
  left
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

  // 피드 데이터
  const feedData: {
    photo: string[];
    date: string;
    content: string;
    tag: string[];
  } = {
    photo: ["/asset/gym2.jpeg", "/asset/gym3.jpeg"],
    date: "2023.08.11",
    content: "오운완!!",
    tag: ["크로스핏", "헬스"],
  };

    // 정보 태그 데이터
    const tagDatas = [
      {
        taglocation: ["15% 5%", "90% 10%", "30% 90%"],
        title: ["adidas", "Nike", "adidas"],
        size: ["XL", "280", "s"],
        price: [33000, 99000, 20000],
      },
      {
        taglocation: ["50% 50%", "10% 30%", "90% 90%"],
        title: ["2adidas", "2Nike", "2adidas"],
        size: ["XL", "280", "s"],
        price: [233000, 299000, 220000],
      },
    ];

function DetailFeedInd() {
  type ResponseDataType = {
    feedId: number;
    content: string;
    relatedTags: string[];
    images: Array<{
      imageId: number;
      imageUrl: string;
      imageTags: any[];
    }>;
  };

  const [responseData, setResponseData] = useState<ResponseDataType | null>(null);
  
  const fetchData = async () => {
    try {
      let response = await fetch('http://13.125.146.181:8080/feed/detail/8');
      let data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  // console.log("받아온 데이터: " + JSON.stringify(responseData, null, 2));

  // const data = JSON.stringify(responseData, null, 2);
  // console.log(data)

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    console.log("게시물 좋아요");
    setIsLiked(true);
  };

  const handleLikeCancelClick = () => {
    console.log("게시물 좋아요 취소");
    setIsLiked(false);
  };

  const inappropriateviewBtn = () => {
    console.log("게시물 신고");
  };

  // 정보 태그 모달창
  const [showTagModal, setShowTagModal] = useState<{
    photoIndex: number;
    tagIndex: number;
  } | null>(null);


  return (
    <div className="w-full sm:max-w-screen-sm  mx-auto px-4 sm:px-4 lg:px-8">
      {/* {responseData?.images.map((image, index) => (
          <div key={index} className="image-container">
              <img src={image.imageUrl} alt={`Image ${index}`} />
          </div>
      ))}

      {feedData.photo.map((photo, photoIndex) => (
        <div key={photoIndex} className="mb-8 relative">
          <img src={photo} alt=" " className="w-full h-auto" />
          {tagDatas[photoIndex].taglocation.map((location, tagIndex) => {
            const [top, left] = location.split(" ");
            return (
              <div
                key={tagIndex}
                className="w-[20px] h-[20px] rounded-full absolute"
                style={{ top, left }}
                onMouseEnter={() => setShowTagModal({ photoIndex, tagIndex })}
                onMouseLeave={() => setShowTagModal(null)}
              >
                <AiFillPlusCircle className="w-[20px] h-[20px] text-tag-btn-color" />
                {showTagModal?.photoIndex === photoIndex &&
                  showTagModal?.tagIndex === tagIndex && (
                    <TagModal
                      title={tagDatas[photoIndex].title[tagIndex]}
                      size={tagDatas[photoIndex].size[tagIndex]}
                      price={tagDatas[photoIndex].price[tagIndex]}
                      // 위치값 전달
                      top={top}
                      left={left}
                    />
                  )}
              </div>
            );
          })}
        </div>
      ))} */}

{responseData?.images.map((image, index) => (
  <div key={index} className="mb-8 relative">
    <img src={image.imageUrl} alt={`Image ${index}`} className="w-full h-auto" />

    {tagDatas[index]?.taglocation.map((location, tagIndex) => {
      // 띄어쓰기로 top,left 나누기
      const [top, left] = location.split(" ");
      return (
        <div
          key={tagIndex}
          className="w-[20px] h-[20px] rounded-full absolute"
          style={{ top, left }}
          onMouseEnter={() => setShowTagModal({ photoIndex: index, tagIndex })}
          onMouseLeave={() => setShowTagModal(null)}
        >
          <AiFillPlusCircle className="w-[20px] h-[20px] text-tag-btn-color" />
          {/* 만약 div위에 마우스 올린게 이미지index와 태그 index가 맞으면 모달창 보여주기 */}
          {showTagModal?.photoIndex === index && showTagModal?.tagIndex === tagIndex && (
            <TagModal
              title={tagDatas[index]?.title[tagIndex]}
              size={tagDatas[index]?.size[tagIndex]}
              price={tagDatas[index]?.price[tagIndex]}
              // 위치값 전달
              top={top}
              left={left}
            />
          )}
        </div>
      );
    })}
  </div>
))}

      <div className="font-bold text-gray-400 text-sm mt-[10px]">
        {feedData.date}
      </div>
      <div className=" mt-[20px]">{responseData?.content}</div>
      <div className=" mt-[20px]">
        {isLiked === false ? (
          <AiOutlineHeart onClick={handleLikeClick} />
        ) : (
          <AiFillHeart onClick={handleLikeCancelClick} />
        )}
      </div>
      <div className=" mt-[40px]">
        <div className="font-bold text-gray-400 text-sm mb-[10px]">
          연관태그
        </div>
        <div>
          {responseData?.relatedTags.map((tag, index) => (
            <span className=" p-1 bg-blue-100 rounded  mr-2" key={index}>
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-[40px] flex flex-wrap">
          {
            tagDatas.map((tagData, dataIndex) => (
              tagData.title.map((_, itemIndex) => (
                <div className="border rounded flex-grow mr-4 mb-4 p-2 text-sm" key={`${dataIndex}-${itemIndex}`}>
                  <div className="flex">
                    <div className="flex-none" style={{ width: "60px" }}>제품명 : </div>
                    <div className="flex-grow font-bold">{tagData.title[itemIndex]}</div>
                  </div>
                  <div className="flex">
                    <div className="flex-none " style={{ width: "60px" }}>가격 : </div>
                    <div>₩ {tagData.price[itemIndex]}</div>
                  </div>
                  <div className="flex">
                    <div className="flex-none" style={{ width: "60px" }}>사이즈 : </div>
                    <div className="text-btn-color">{tagData.size[itemIndex]}</div>
                  </div>
                </div>
              ))
            ))
          }
        </div>

    </div>

      <div className="flex justify-end mt-4">
        <button onClick={inappropriateviewBtn} className="focus:outline-none">
          <RiAlarmWarningFill />
        </button>
      </div>
    </div>
  );
}

export default DetailFeedInd;