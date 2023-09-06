import BackButton from "../components/atoms/BackButton";
import BlueButton from "../components/atoms/BlueButton";

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

      const tempData = [
        {
          proFileImg: "/asset/profile.png",
          userId: "ImHello",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "헬스",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ImTaeyoung",
          feedImg: "/asset/feedpicture.png",
          userInfo: "서울은 비가 올거 같아요",
          tags: "헬스",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ImAGoodBoy",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오운완!",
          tags: "헬스",
          location: "경기",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID123",
          feedImg: "/asset/feedpicture.png",
          userInfo: "뛰나요?",
          tags: "크로스핏",
          location: "경기",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID777",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "크로스핏",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "IDABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "크로스핏",
          location: "인천",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID123ABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "수영",
          location: "강원",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID888888",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "수영",
          location: "강원",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "IDABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "수영",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID123ABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "홈트",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID888888",
          feedImg: "/asset/test.png",
          userInfo: "팬티 단돈 99000원",
          tags: "홈트",
          location: "인천",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "IDABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "농구",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID123ABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "축구",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID888888",
          feedImg: "/asset/test.png",
          userInfo: "팬티 단돈 99000원",
          tags: "축구",
          location: "부산",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "IDABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "축구",
          location: "부산",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID123ABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "농구",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "ID888888",
          feedImg: "/asset/test.png",
          userInfo: "팬티 단돈 99000원",
          tags: "농구",
          location: "서울",
        },
        {
          proFileImg: "/asset/profile.png",
          userId: "IDABC",
          feedImg: "/asset/feedpicture.png",
          userInfo: "오늘은 날씨가 좋네요",
          tags: "농구",
          location: "서울",
        },
      ];

      // 팔로우
  const followClick =() =>{
    console.log('팔로우하기')
  }


  return (
    <div className="w-[1100px] ml-[100px] ">
        <BackButton />
        <div>
        <div className="float-right">
            <BlueButton label="팔로우"  onClick={followClick} />
        </div>
        <img src={userData[0].userphoto}  className='w-[80px] h-[80px] rounded-full float-left mr-4' />
      
        <div className="font-bold text-xl mt-[4px]">{userData[0].username}</div>
        <div className="flex space-x-2 font-bold text-gray-400 text-sm ">
                <div>{userData[0].userheight}cm</div>
          <div>{userData[0].userweight}kg</div>
        </div>
        </div>
        <div className=" mt-[60px]">
            {/* 아이콘 넣기 */}
            <div className='text-sm font-bold text-gray-400 '><FontAwesomeIcon icon={faHeart} className='mr-[10px]' />{userData[0].userexercise}</div>
            <div className='text-sm font-bold text-gray-400 '><FontAwesomeIcon icon={faUser} className='mr-[10px]' />{userData[0].userintroduction}</div>
        </div>
        <div className=" mt-[60px]">
            {/* 피드 리스트 넣기 */}
            {
                tempData
                .filter(item => item.userId === "ID888888")
                .map((item, index) => (
                    <div key={index} className='float-left flex '>
                        <img className="w-[250px] h-[300px] mr-[24px] mb-[24px]" src={item.feedImg}/>
                    </div>
                ))
            }
        </div>
    </div>
  );
}

export default Profile;
