import { useState } from "react";
import {AiOutlineHeart , AiFillHeart} from 'react-icons/ai';
import {RiAlarmWarningFill} from 'react-icons/ri';



function DetailFeedCor() {
    // 피드 데이터
  let feedData : {
    photo : string[],
    date :string, 
    content :string ,
    tag :string[],
  } = {
    photo : ['/asset/gym2.jpeg','/asset/gym3.jpeg'],
    date : '2023.08.11',
    content : '오운완!!',
    tag : ['크로스핏', '헬스'],
  }

  // 좋아요
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    console.log('게시물 좋아요')
    setIsLiked(true);
  };

  const handleLikeCancelClick = () => {
    console.log('게시물 좋아요 취소')
    setIsLiked(false);
  };

  const inappropriateviewBtn = () => {
    console.log('게시물 신고')
  }
  return(
    // 화면 최대 넓이를 중간크기로, 수평 중앙 위치, 패딩조절
    <div className='w-full sm:max-w-screen-sm  mx-auto px-4 sm:px-4 lg:px-8'>
        {
            feedData.photo.map((photo,index) => (
                <div className='mb-8' key={index}>
                    <img src={photo} className='w-full h-auto'/>
                </div>
            ))
        }
        <div className="font-bold text-gray-400 text-sm mt-[10px]" >{feedData.date}</div>
        <div className=" mt-[20px]">{feedData.content}</div>
        <div className=" mt-[20px]">
            {
              isLiked === false ? 
              <AiOutlineHeart  onClick={ handleLikeClick }/> : 
              <AiFillHeart onClick={ handleLikeCancelClick } />
            }
        </div>
        <div className=" mt-[40px]">
            <div className="font-bold text-gray-400 text-sm mb-[10px]">연관태그</div>
            <div>
                {
                    feedData.tag.map((item,index)=>(
                        <span  className=" p-1 bg-blue-100 rounded  mr-2" key={index}>{item}</span>
                    ))
                }
            </div>
        </div>
        <div className="flex justify-end mt-4">
            <button onClick={inappropriateviewBtn} className='focus:outline-none'><RiAlarmWarningFill /></button>
        </div>
    </div>

  ) 
}

export default DetailFeedCor;
