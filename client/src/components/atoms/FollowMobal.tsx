import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis} from '@fortawesome/free-solid-svg-icons';

const btnfollowcss = 'w-[70px] h-[20px] rounded-[4px] text-[12px] mr-[8px] font-medium bg-btn-color text-white';
const btnfollowcancelcss = 'w-[70px] h-[20px] rounded-[4px] text-[12px] mr-[8px] font-medium border';

const Modal = ({ onClose }:any) => (
    <div className='flex flex-col w-[40px] border'>
        <button  onClick={onClose} className='w-auto p-1 border-b text-[12px]'>수정</button>
        <button  onClick={onClose} className='w-auto p-1 text-[12px]'>삭제</button>
    </div>
);

function FollowMobal() {
    const [follow, setFollow] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);


    const followClick =() =>{
        setFollow(true);
        console.log('팔로우하기',follow); 
    }

    const followCancelClick =() =>{
        setFollow(false);
        console.log('팔로우 취소',follow);
    }
    
    const handleOpenModal = () =>{
        setModalOpen(true);
        console.log('모달창 열기',isModalOpen)
    }

    const handleCloseModal = () =>{
        setModalOpen(false);
        console.log('모달창 닫기',isModalOpen)
    }

    return(
        <div className="flex">
            <div className='float-left'>
            {
                follow === false ? 
                <button type='submit' className={btnfollowcss} onClick={followClick}>팔로우</button> : 
                <button type='submit' className={btnfollowcancelcss} onClick={followCancelClick}>팔로잉</button>
            }
            </div>
            <div>
                <button onClick={handleOpenModal} ><FontAwesomeIcon icon={faEllipsis} /></button>
                {isModalOpen && <Modal onClose={handleCloseModal} />}
            </div>
        </div>
    )
}

export default FollowMobal;
