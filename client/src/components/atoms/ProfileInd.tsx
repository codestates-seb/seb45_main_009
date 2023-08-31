import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

// 아이콘 가져오기
import {
  faEllipsis,
} from '@fortawesome/free-solid-svg-icons';

let userData = [
  {
    username: 'Lee seeun',
    useremail: 'lse@gmail.com',
    pw: '1234',
    userheight : 170,
    userweight : 60,
    userphoto : 'img.png'
  }
];

const Modal = ({ onClose } :any) => (
  <div className="flex  flex-col border ml-[55px] w-[60px] h-[50px] rounded">
    <button onClick={onClose} className='border-b'>삭제</button>
    <button onClick={onClose}>수정</button>
  </div>
);


function ProfileInd() {
  const navigate = useNavigate();

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
    <div>
        <div className=" absolute top-[80px] left-[1000px]">
          <button className="pr-4" onClick={followClick} >팔로우</button>
          <button className="float-none" onClick={handleOpenModal}><FontAwesomeIcon icon={faEllipsis} /></button>
          {isModalOpen && <Modal onClose={handleCloseModal} />}
      </div>
      
      <img src={userData[0].userphoto}  className='w-20 h-20 rounded-full float-left mr-4' />
      
      <div>
        <div className="font-bold text-2xl">{userData[0].username}</div>
        <div className="flex space-x-4 font-bold text-gray-400 text-sm ">
          <div>{userData[0].userheight}cm</div>
          <div>{userData[0].userweight}kg</div>
        </div>
      </div>
    </div>

  ) 
}

export default ProfileInd;
