import React, { useState } from "react";

function AlarmPage() {
  type AlarmItem = {
    name: string;
    photo: string;
    date: string;
    content: string;
  };

  let [data, setData] = useState<AlarmItem[]>([
    {
      name: "Lee seeun",
      photo: "/asset/gym1.jpeg",
      date: "2023-08-01",
      content: "회원님의 게시물을 좋아합니다.",
    },
    {
      name: "user 3",
      photo: "/asset/gym1.jpeg",
      date: "2023-08-12",
      content: "회원님을 팔로우하기 시작했습니다.",
    },
    {
      name: "user 4",
      photo: "/asset/gym2.jpeg",
      date: "2023-08-19",
      content: "회원님의 게시물에 댓글을 남겼습니다.",
    },
    {
      name: "user 3",
      photo: "/asset/gym3.jpeg",
      date: "2023-08-22",
      content: "회원님을 팔로우하기 시작했습니다.",
    },
  ]);

  const handleDeleteComment = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const handleDeleteAllComment = () => {
    setData([]);
  };

  return (
    <div className="flex justify-center min-h-screen px-[10px]  md:px-[60px] lg:px-[200px] mt-[40px]">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="text-[20px] font-semibold">내 소식</div>
          <button
            className="text-[14px] font-medium w-[140px] h-[30px] rounded-[4px] bg-red-600 text-white"
            onClick={handleDeleteAllComment}
          >
            모두 삭제하기
          </button>
        </div>

        <div className="mt-[20px]">
          {data.map((item, index) => (
            <div key={index} className="flex items-center border my-[15px] p-[10px]">
              <img className="w-[50px] h-[50px] rounded-full mr-[20px]" src={item.photo} alt={item.name} />
              <div className="flex-grow">
                <div className="font-bold text-[18px] mb-[5px]">{item.name}</div>
                <div>{item.content}</div>
                <div className="font-bold text-[12px] text-gray-400 mt-[4px]">{item.date}</div>
              </div>
              <button
                onClick={() => handleDeleteComment(index)}
                className="w-[20px] h-[20px] flex items-center justify-center text-red-600 ml-[10px]"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlarmPage;
