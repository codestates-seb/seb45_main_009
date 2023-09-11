import { useState, useRef, useEffect } from "react";
import { FaEllipsisH, FaUserAlt } from 'react-icons/fa';
import { AiFillHeart } from 'react-icons/ai';


import BackButton from "../components/atoms/BackButton";

let userData = [
  {
    username: 'Lee seeun',
    useremail: 'lse0522@gmail.com',
    pw: '1234',
    userheight : 170,
    userweight : 60,
    userphoto : '/asset/img.png',
    userexercise: '헬스',
    userintroduction : '헬스를 좋아합니다~'
  }
];

const Modal = ({ onClose } :any) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  // const modalRef = useRef(null);

  useEffect(() => {
    // 클릭 이벤트를 처리하는 함수
    const handleClickOutside = (event: MouseEvent) => {
      // 만약 event.target as Node 가 !modalRef.current의 자손 or 동일한 노드인 경우 true 그렇지 않으면 false 반환한다.
      // 모달참조의 자신이 아닌 경우 클릭했을때 모달을 닫아야 한다.

      // modalRef.current 타입을 never로 
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    }

    // 이벤트 리스너를 문서에 추가
    document.addEventListener("mousedown", handleClickOutside);
    
    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [onClose]);

  return(
    <div ref={modalRef} className='flex flex-col border rounded-[4px] w-[100px] 
      absolute  md:right-[60px] right-[100px] md:top-[200px] top-[280px] '>
      <button onClick={onClose} className='border-b'>삭제</button>
      <button onClick={onClose}>수정</button>
    </div>
    )
};

function Profile() {
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

    // 모달창
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
      setModalOpen(true);
      console.log("모달 열기")
    };
    
    const handleCloseModal = () => {
      setModalOpen(false);
    };

    // 팔로우
    const [isFollowing, setIsFollowing] = useState(false);

    const followClick = () => {
      if (isFollowing) {
        console.log('팔로우 취소');
      } else {
        console.log('팔로우하기');
      }
      // 팔로우 상태 토글
      setIsFollowing(!isFollowing);
    };



  return (
    <div className="flex justify-center min-h-screen">
    <BackButton />
    <div className='max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-8 mt-[100px]'>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">

        <div className="flex items-center ">
          <img src={userData[0].userphoto} className="w-[80px] h-[80px] rounded-full mr-4 " />
          
          <div className="flex flex-col">
            <div className="font-bold text-xl ">{userData[0].username}</div>
            <div className="font-bold text-gray-400 text-sm flex">
              <div className='mr-[4px]'>{userData[0].userheight}cm</div>
              <div>{userData[0].userweight}kg</div>
            </div>
          </div>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button className="w-[100px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white" onClick={followClick}>
            {isFollowing ? '팔로잉' : '팔로우'} 
          </button>
          <button onClick={handleOpenModal} className='relative'><FaEllipsisH /></button>
          {isModalOpen && <Modal onClose={handleCloseModal} />}
        </div>



        <div className="hidden md:flex items-center justify-end md:justify-start">  
          <button className="ml-[200px] mr-4 w-[100px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white" onClick={followClick}>
            {isFollowing ? '팔로잉' : '팔로우'} 
          </button>
          <button onClick={handleOpenModal}  className='relative'><FaEllipsisH /></button>
          {isModalOpen && <Modal onClose={handleCloseModal} />}
        </div>

        <div className="mt-[20px]">
          <div className="flex items-center space-x-2">
            <div className="text-gray-400"><AiFillHeart /></div>
            <div>{userData[0].userexercise}</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-gray-400"><FaUserAlt /></div>
            <div>{userData[0].userintroduction}</div>
          </div>
        </div>
        
      </div>

      <div className=" mt-[60px]">
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
  </div>
  );
}

export default Profile;