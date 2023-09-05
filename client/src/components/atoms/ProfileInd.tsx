import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";

// 아이콘 가져오기
import {
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';

let userData = [
  {
    username: 'Lee seeun',
    useremail: 'lse0522@gmail.com',
    pw: '1234',
    userheight : 170,
    userweight : 60,
    userphoto : 'img.png',
    userintroduction : '헬스를 좋아합니다~'
  }
];

const Modal = ({ onClose } :any) => (
  <div className="flex  flex-col border ml-[55px] w-[60px] h-[50px] rounded">
    <button onClick={onClose} className='border-b'>삭제</button>
    <button onClick={onClose}>수정</button>
  </div>
);


function ProfileInd() {

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
        <div className="float-right ">
          <button className="pr-4" onClick={followClick} >팔로우</button>
          <button className="mr-[60px]" onClick={handleOpenModal}><FontAwesomeIcon icon={faEllipsis} /></button>
          {isModalOpen && <Modal onClose={handleCloseModal} />}
        </div>
      
        <img src={userData[0].userphoto}  className='w-[80px] h-[80px] rounded-full float-left mr-4' />
      
        <div className="font-bold text-xl mt-[4px]">{userData[0].username}</div>
        <div className="flex space-x-2 font-bold text-gray-400 text-sm ">
          <div>{userData[0].userheight}cm</div>
          <div>{userData[0].userweight}kg</div>
        </div>
        <div className='text-sm font-bold text-gray-400'>{userData[0].userintroduction}</div>

    </div>

  ) 
}

export default ProfileInd;
