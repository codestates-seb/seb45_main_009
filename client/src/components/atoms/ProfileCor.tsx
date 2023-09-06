import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";

// 아이콘 가져오기
import {
  faEllipsis,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

  const userData = [
    {
      username: '버퍼짐 휘트니스',
      useremail: 'gym@gmail.com',
      pw: '1234',
      userphoto : '/asset/gym.png',
      useraddress : '서울특별시 노원역 노원역점',
      userintroduction : '헬스 크로스핏'
    }
  ];

  const Modal = ({ onClose } :any) => (
    // absolute top-[200px] mt-2 right-[230px]
    <div className='flex flex-col border rounded-[4px] w-[100px]'>
      <button onClick={onClose} className='border-b'>삭제</button>
      <button onClick={onClose}>수정</button>
    </div>
  );

function ProfileCor() {
    // 모달창 열기 닫기
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
      setModalOpen(true);
      console.log("모달 열기")
    };
    
    const handleCloseModal = () => {
      setModalOpen(false);
    };

    // 팔로우
    const followClick =() =>{
      console.log('팔로우하기')
    }

  return(
  <div className="flex justify-center">
    <div className="grid md:grid-cols-2 gap-4 items-center ">
    <div className="flex items-center border ">
      <img src={userData[0].userphoto} className="w-[80px] h-[80px] rounded-full border mr-4 " />
      <div className="flex flex-col">
        <div className="font-bold text-xl mr-[140px]">
          {userData[0].username}
          <FontAwesomeIcon className='ml-[10px]' icon={faCircleCheck} />
        </div>
        <div className="font-bold text-gray-400 text-sm ">
          <div>{userData[0].useraddress}</div>
          <div>{userData[0].userintroduction}</div>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-end md:justify-start">
      <button className="ml-[200px] mr-4 w-[100px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white" onClick={followClick}>팔로우</button>
      <button onClick={handleOpenModal}  className='relative'>
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
      {isModalOpen && 
        <Modal onClose={handleCloseModal} />
      }
    </div>
    </div>
  </div>
  ) 
}

export default ProfileCor;