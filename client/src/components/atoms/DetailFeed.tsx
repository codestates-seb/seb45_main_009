import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";


// 아이콘 가져오기
import {
    faHeart,
    faThumbsUp
  } from '@fortawesome/free-solid-svg-icons';

function DetailFeed() {
    // 피드 데이터
    // 피드 고유 아이디
    // get 요청 했을때
    // 댓글이랑 좋아요 추가적인 데이터를 한번에 오도록

    // 로그인 시큐얼티..? 승범 동훈,
    // 피드쪽 소연 은영,

  let feedData : {
    feedid : number,
    photo : string[],
    date :string, 
    content :string ,
    tag :string[]
  } = {
    feedid : 1,
    photo : ['/asset/gym1.jpeg','/asset/gym2.jpeg','/asset/gym3.jpeg'],
    date : '2023.08.11',
    content : '오늘도 오운완 성공!',
    tag : ['크로스핏', '헬스']
  }

  let feedproductData : {
    product : string[], 
    price : number[],
    size : string[]
    } = {
    product : ['adidas','나이키'],
    price : [99000, 13000],
    size : ['XL사이즈', '260mm']
  }

  const taglength = feedproductData.product.length;
  console.log(taglength)

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
            <div className='flex'>

            <div className="border rounded p-4 flex float-left  w-auto mr-[20px]">
                <div className="float-left mr-[14px]">
                    <div>제품</div>
                    <div>가격</div>
                    <div>사이즈</div>
                </div>
                <div>
                    <div className="font-bold">{feedproductData.product[0]}</div>
                    <div>₩ {feedproductData.price[0]}</div>
                    <div className="text-blue-300">{feedproductData.size[0]}</div>
                </div>
            </div>

            <div className="border rounded p-4 flex float-left  w-auto">
                <div className="float-left mr-[14px]">
                    <div>제품</div>
                    <div>가격</div>
                    <div>사이즈</div>
                </div>
                <div>
                    <div className="font-bold">{feedproductData.product[1]}</div>
                    <div>₩ {feedproductData.price[1]}</div>
                    <div className="text-blue-300">{feedproductData.size[1]}</div>
                </div>
            </div>
            </div>
        </div>
        <div className="float-right mt-[10px]" onClick={inappropriateviewBtn}>🚨</div>

    </div>

  ) 
}

export default DetailFeed;