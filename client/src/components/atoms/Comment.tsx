// import React, { InputHTMLAttributes } from 'react';

// interface CommentProps extends InputHTMLAttributes<HTMLInputElement> {

// }


// const Comment :React.FC<CommentProps> = () => {

//     return (
//       <div className='mt-[60px]'>
//         <div>댓글 </div>
//       </div>
//     );
//   };
  

// export default Comment;

import { useState } from "react";



function Comment() {


    // 댓글생성
  const [inputValue, setInputValue]  = useState<string>('');
  let [arr, setArr]= useState<string[]>(['멋있어요']);
  // 댓긋 시간 arr 저장
  let [commentdate, setCommentDate]= useState<string[]>(['2023.07.22']);
  let [currentTime, setCurrentTime] = useState<string[]>(['10시']);

  const [iscomment, setIsComment] = useState(false);
  const [inputUpdateValue, setInputUpdateValue]  = useState<string>('');

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUpdateValue(event.target.value);
    console.log(inputUpdateValue)
  }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleEditComment = () => {
        setIsComment(true)
        console.log("버튼 클릭")
      }
      const handleUpdateComment = (index:number)=> {
        arr[index] = inputUpdateValue;
        setIsComment(false)
      }


    const handleSaveClick = () => {
        setArr(prevArr => [inputValue, ...prevArr]);
        const now = new Date();
        const dateString = now.toLocaleDateString();
        const timeString = now.toLocaleTimeString(); 
        setCommentDate(dateArr => [...dateArr,dateString]);
        setCurrentTime(timeArr => [...timeArr,timeString]);
    }

    const handleDeleteComment = (index:number) =>{
        console.log('삭제버튼 클릭')
        console.log(index)
        const newdelete = [...arr];
        newdelete.splice(index, 1);
        setArr(newdelete)
      }

  return(
    <div className=" mb-[60px]">
        <div className=" mt-[80px]">
                  <div className="flex items-center">
                  <img src='/asset/img.png'  className='w-[30px] h-[30px] rounded-full float-left mr-4' />
                  <div className="border rounded p-1 w-full">

                  <input 
                      className=" rounded w-[500px]" 
                      type='text' 
                      placeholder="댓글을 남겨보세요."
                      onChange={handleInputChange}
                      />
                  <button 
                      className=" rounded float-right mr-[10px]"
                      onClick={handleSaveClick}
                      >입력</button>
                  
                  </div>
                  </div> 
        </div>
            <div className=" mt-[40px]">
        {
          arr.map((item,index) =>(

        <div key={index} >

          <div className=" mt-[40px] flex items-center mb-[10px]  justify-between">
            <div className="flex">
              <img src='/asset/img.png'  className='w-[30px] h-[30px] rounded-full float-left mr-4' />
              <div className="font-bold">Lee seeun</div>
            </div>
          <div className="flex">
            <button className=" text-gray-400 text-sm " onClick={handleEditComment} >수정</button>
            <button className="ml-[8px] text-gray-400 text-sm" onClick={()=>handleDeleteComment(index)} >삭제</button>
          </div>
          </div>
          {
            iscomment === false ? 
              <div className=" ml-[40px]">{item}</div> : 
              <div>
              <input className="border  ml-[40px] rounded w-[300px]"  type="text"  placeholder={item} onChange={handleCommentChange}/>
              <button className=" text-gray-400 text-sm " onClick={()=>handleUpdateComment(index)}>저장</button>
              </div>
          }
          <div className=" ml-[40px] mt-[10px] text-gray-400 text-sm ">{commentdate[index]}{currentTime[index]}</div>
            </div>
          ))
        }
        </div>
    </div>
  ) 
}

export default Comment;
