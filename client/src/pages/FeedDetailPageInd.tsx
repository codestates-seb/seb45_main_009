// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import FollowMobal from "../components/atoms/FollowMobal";
import Profile from '../components/atoms/Profile'
import DetailFeed from "../components/atoms/DetailFeed";
import Comment from "../components/atoms/Comment";

// 아이콘 가져오기
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import {
    faHeart,
    faThumbsUp
  } from '@fortawesome/free-solid-svg-icons';


function FeedDetailPageInd() {
  // 유저 데이터
  let userData : {
    username : string,
    userphoto : string,
    userheight : number,
    userweight : number,
    usercontent : string,
  } = {
    username : 'Lee seeun',
    userphoto : '/asset/img.png',
    userheight : 188,
    userweight : 60,
    usercontent : '운동,헬스를 좋아합니다!',
  }
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

  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = () => {
    console.log('게시물 좋아요')
    setIsLiked(true);
  };

  const handleLikeCancelClick = () => {
    console.log('게시물 좋아요 취소')
    setIsLiked(false);
  };


  return (
  <div>
    <div className="sm:ml-[30px] md:ml-[60px] lg:ml-[100px]"> <BackButton /> </div>
    <div className="w-full pr-[150px] pl-[150px]">
      <div className="flex justify-center">
        <div className="w-[90%]">
          <Profile
            photourl={userData.userphoto} 
            userid={userData.username} 
            userheight={userData.userheight} 
            userweight={userData.userweight}
            usercontent={userData.usercontent}/>
        </div>
        <div  className="w-[10%]">
          <FollowMobal />
        </div>
      </div>
    </div>

    <div className='w-[full] mt-[60px] flex justify-center'>
      <div>
        {
          feedData.photo.map((i, index) => (
            <DetailFeed key={index} photourl={i}/>
          ))
        }
      <DetailFeed date={feedData.date}/>
      <DetailFeed content={feedData.content}/>
      <div className=" mt-[20px]">
            {
              isLiked === false ? 
              <FontAwesomeIcon icon={faHeart}  onClick={ handleLikeClick }/> : 
              <FontAwesomeIcon icon={faThumbsUp} onClick={ handleLikeCancelClick } />
            }
        </div>

        <div className="flex mb-[40px]">
          <Comment />
        </div>
    </div>

  </div>
  </div>

);
}

export default FeedDetailPageInd;
