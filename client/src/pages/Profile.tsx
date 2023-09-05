import BackButton from "../components/atoms/BackButton";
import Feed from "../components/atoms/Feed";
import React, { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faUser
} from '@fortawesome/free-solid-svg-icons';



function Profile() {
    let userData = [
        {
          username: 'Lee seeun',
          useremail: 'lse0522@gmail.com',
          pw: '1234',
          userheight : 170,
          userweight : 60,
          userphoto : 'img.png',
          userexercise : ['헬스', '크로스핏', '필라테스'],
          userintroduction : '헬스를 좋아합니다~'
        }
      ];

      // 팔로우
  const followClick =() =>{
    console.log('팔로우하기')
  }


  return (
    <div className="w-[1000px] ml-[100px] ">
        <BackButton />
        <div>
        <div className="float-right ">
           <button className="pr-4" onClick={followClick} >팔로우</button>
        </div>
        <img src={userData[0].userphoto}  className='w-[80px] h-[80px] rounded-full float-left mr-4' />
      
        <div className="font-bold text-xl mt-[4px]">{userData[0].username}</div>
        <div className="flex space-x-2 font-bold text-gray-400 text-sm ">
                <div>{userData[0].userheight}cm</div>
          <div>{userData[0].userweight}kg</div>
        </div>
        </div>
        <div className="border mt-[60px]">
            {/* 아이콘 넣기 */}
            <div className='text-sm font-bold text-gray-400 border'><FontAwesomeIcon icon={faHeart} className='mr-[10px]' />{userData[0].userexercise}</div>
            <div className='text-sm font-bold text-gray-400 border'><FontAwesomeIcon icon={faUser} className='mr-[10px]' />{userData[0].userintroduction}</div>
        </div>
        <div className="border mt-[60px]">
            {/* 피드 리스트 넣기 */}
        </div>
    </div>
  );
}

export default Profile;
