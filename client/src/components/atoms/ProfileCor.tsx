import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";

// 아이콘 가져오기
import {
  faEllipsis,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

  let userData = [
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
    <div className="flex  flex-col border ml-[55px] w-[60px] h-[50px] rounded">
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
    <div className='ml-[60px]'>
        <div className="float-right">
          <button className="pr-4" onClick={followClick} >팔로우</button>
          <button className="mr-[60px]" onClick={handleOpenModal}><FontAwesomeIcon icon={faEllipsis} /></button>
          {isModalOpen && <Modal onClose={handleCloseModal} />}
        </div>


        <div className=' w-[300px]'>

        <img src={userData[0].userphoto}  className='w-[80px] h-[80px] rounded-full float-left mr-4' />
        <FontAwesomeIcon icon={faCircleCheck} className="float-right"/>
        <div className="font-bold text-xl mt-[4px]">{userData[0].username}</div>
        <div className=" font-bold text-gray-400 text-sm ">
          <div>{userData[0].useraddress}</div>
          <div>{userData[0].userintroduction}</div>
        </div>
        </div>
    </div>

  ) 
}

export default ProfileCor;