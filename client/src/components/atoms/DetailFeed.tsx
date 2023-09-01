import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";


// 아이콘 가져오기
import {
    faHeart,
    faThumbsUp
  } from '@fortawesome/free-solid-svg-icons';


function DetailFeed() {
    // 피드 데이터
  let feedData : {
    photo : string,
    date :string, 
    content :string ,
    product : string, 
    price : number,
    size : string,
    tag :string[]
  } = {
    photo : 'gym.jpeg',
    date : '2023.08.11',
    content : '오늘도 오운완 성공!',
    product : 'adidas',
    price : 99000,
    size : 'XL사이즈',
    tag : ['크로스핏', '헬스']
  }

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    setIsLiked(true);
  };


  return(

    <div>
        <img src={feedData.photo}  className='w-[400px] h-[400px]' />
        <div className="font-bold text-gray-400 text-sm mt-[10px]" >{feedData.date}</div>
        <div className=" mt-[20px]">{feedData.content}</div>
        <div className=" mt-[20px]" onClick={ handleLikeClick }>
            {
                isLiked === false ? 
                <FontAwesomeIcon icon={faHeart} /> : 
                <FontAwesomeIcon icon={faThumbsUp} />
            }
        </div>

        <div className=" mt-[40px]">
            <div className="font-bold text-gray-400 text-sm mb-[10px]">연관태그</div>
            <div>
                {
                    feedData.tag.map((item,index)=>(
                        <span  className=" p-1 bg-blue-100 w-auto rounded  mr-2" key={index}>{item}</span>
                    ))
                }
            </div>
        </div>

        <div className=" mt-[40px]">
            <div className="font-bold text-gray-400 text-sm mb-[10px]">착용 제품</div>
            <div className="border rounded p-3">
                <div className="float-left mr-[14px]">
                    <div>제품</div>
                    <div>가격</div>
                    <div>사이즈</div>
                </div>
                <div>
                    <div className="font-bold">{feedData.product}</div>
                    <div>₩ {feedData.price}</div>
                    <div className="text-blue-300">{feedData.size}</div>
                </div>
            </div>
        </div>
        <div className="float-right mt-[10px]">🚨</div>

    </div>

  ) 
}

export default DetailFeed;
