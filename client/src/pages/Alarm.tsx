import React, { useState } from 'react';

function Alarm() {
    type AlarmItem = {
        name: string;
        photo: string;
        date: string;
        content: string;
    };

    let [data, setData] = useState<AlarmItem[]>([
        {
            name: 'Lee seeun',
            photo : '/asset/gym1.jpeg',
            date : '2023-08-01',
            content : '회원님의 게시물을 좋아합니다.'
        },
        {
            name: 'user 3',
            photo : '/asset/gym1.jpeg',
            date : '2023-08-12',
            content : '회원님을 팔로우하기 시작했습니다.'
        },
        {
            name: 'user 4',
            photo : '/asset/gym2.jpeg',
            date : '2023-08-19',
            content : '회원님의 게시물에 댓글을 남겼습니다.'
        },
        {
            name: 'user 3',
            photo : '/asset/gym3.jpeg',
            date : '2023-08-22',
            content : '회원님을 팔로우하기 시작했습니다.'
        },
        ]);

        const handleDeleteComment = (index: number)=> {
            const newData = [...data];
            newData.splice(index, 1);
            setData(newData);
        }

        const handleDeleteAllComment = ()=> {
            setData([]);
        }

  return (
    <div className=" ml-[200px] mr-[200px]">
        <div className="flex justify-between">
            <div className="text-[20px] font-semibold">내 소식</div>
            <button className=" text-[14px] font-medium w-[140px] h-[30px] rounded-[4px] bg-red-600 text-white"  onClick={handleDeleteAllComment}>모두 삭제하기</button>
        </div>

        <div>

            {
                data.map((item,index) =>(
                    <div key={index} className="mt-[30px] mb-[30px] w-full h-[50px] border">
                        <img className="w-[50px] h-[50px] rounded-full float-left mr-[20px]" src={item.photo} alt={item.name} />
                            <div onClick={() => handleDeleteComment(index)} className="cursor-pointer float-right w-[20px] h-[50px] flex items-center float-right">❌</div>
                            <div className="">
                                <div className="font-bold text-[18px] mr-[10px] float-left mt-[6px] w-[120px]">{item.name}</div>
                                <div className="clear-none flex items-center">{item.content}</div>
                                <div className="font-bold text-[12px] text-gray-400 mr-[50px] mt-[4px] clear-none">{item.date}</div>
                            </div> 
                    </div>
                ))
            }
        </div>
    </div>
  );
}

export default Alarm;
