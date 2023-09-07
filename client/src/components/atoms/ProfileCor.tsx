import { useState, useRef, useEffect } from "react";
import { BsFillBookmarkStarFill } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';


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

  const Modal = ({ onClose } :any) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    // const modalRef = useRef(null);

    useEffect(() => {
      // 클릭 이벤트를 처리하는 함수
      const handleClickOutside = (event: MouseEvent) => {
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
  <div className='max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8'>
    <div className="grid md:grid-cols-2 gap-4 items-center ">
    <div className="flex items-center">
      <img src={userData[0].userphoto} className="w-[80px] h-[80px] rounded-full mr-4 " />
      <div className="flex flex-col">
        <div className="grid grid-cols-[3fr,1fr] items-center">
          <div className="font-bold text-xl truncate ">{userData[0].username}</div>
          <div><BsFillBookmarkStarFill /></div>
      </div>
        <div className="text-gray-400 text-xs ">
          <div className="mt-[2px]">{userData[0].useraddress}</div>
          <div>{userData[0].userintroduction}</div>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-end md:justify-start">
      <button className="ml-[200px] mr-4 w-[100px] h-[30px] rounded-[4px] text-[14px] font-medium bg-btn-color text-white" onClick={followClick}>팔로우</button>
      <button onClick={handleOpenModal}  className='relative'>
      <FaEllipsisH />
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