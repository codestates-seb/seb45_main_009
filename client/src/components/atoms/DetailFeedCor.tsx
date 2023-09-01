import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";


// 아이콘 가져오기
import {
    faHeart,
    faThumbsUp
  } from '@fortawesome/free-solid-svg-icons';

function DetailFeedCor() {
    // 피드 데이터
  let feedData : {
    photo : string[],
    date :string, 
    content :string ,
    price : string[],
    tag :string[],
    addresstag : string[]
  } = {
    photo : ['/asset/gym1.jpeg','/asset/gym2.jpeg','/asset/gym3.jpeg'],
    date : '2023.08.11',
    content : '여름이벤트!',
    price : ['1회 체험 세션 - 40,000원', 
            '10회(PT+이용권+락카) - 600,000원', 
            '20회(PT+이용권+락카) - 1,150,000원', 
            '30회(PT+이용권+락카) - 1,650,000원', 
            '40회(PT+이용권+락카) - 2,100,000원'],
    tag : ['크로스핏', '헬스'],
    addresstag : ['서울','인천']
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
    <div className='w-[600px]'>
        {
            feedData.photo.map((index,item) => (
                <div className='mb-[30px]'>
                    <img src={index} />
                </div>
            ))
        }
        <div className="font-bold text-gray-400 text-sm mt-[10px]" >{feedData.date}</div>
        <div className=" mt-[20px]">{feedData.content}</div>
        <div className=" mt-[20px]">
            {
              isLiked === false ? 
              <FontAwesomeIcon icon={faHeart}  onClick={ handleLikeClick }/> : 
              <FontAwesomeIcon icon={faThumbsUp} onClick={ handleLikeCancelClick } />
            }
        </div>

        <div className=" mt-[40px]">
            <div className="font-bold text-gray-400 text-sm mb-[10px]">가격</div>
            <div>
                {
                    feedData.price.map((index,item) => (
                            <div>{index}</div> 
                    ))
                }
            </div>
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
            <div className="font-bold text-gray-400 text-sm mb-[10px]">지역 태그</div>
            <div>
                {
                    feedData.addresstag.map((item,index)=>(
                        <span  className=" p-1 bg-blue-100 w-auto rounded  mr-2" key={index}>{item}</span>
                    ))
                }
            </div>
        </div>

        
        <div className="float-right mt-[10px]" onClick={inappropriateviewBtn}>🚨</div>

    </div>

  ) 
}

export default DetailFeedCor;
