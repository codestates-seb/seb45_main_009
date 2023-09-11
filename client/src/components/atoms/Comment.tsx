import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

function Comment() {
  // 댓글생성
  const [commentInputValue, setCommentInputValue] = useState<string>("");
  let [comment, setComment] = useState<string[]>(["멋있어요"]);
  // 댓긋 시간 arr 저장
  let [commentdate, setCommentDate] = useState<string[]>(["2023.07.22"]);
  let [currentTime, setCurrentTime] = useState<string[]>(["10시"]);

  const [iscomment, setIsComment] = useState(false);
  const [inputUpdateValue, setInputUpdateValue] = useState<string>("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUpdateValue(event.target.value);
    console.log(inputUpdateValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInputValue(event.target.value);
  };

  const handleEditComment = () => {
    setIsComment(true);
    console.log("버튼 클릭");
  };
  const handleUpdateComment = (index: number) => {
    comment[index] = inputUpdateValue;
    setIsComment(false);
  };

  const handleSaveClick = () => {
    setComment((prevArr) => [ ...prevArr,commentInputValue]);
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    setCommentDate((dateArr) => [ ...dateArr, dateString]);
    setCurrentTime((timeArr) => [...timeArr, timeString]);
  };

  const handleDeleteComment = (index: number) => {
    console.log("삭제버튼 클릭");
    console.log(index);
    const newdelete = [...comment];
    newdelete.splice(index, 1);
    setComment(newdelete);
  };
  console.log(commentdate, currentTime);

  const [page, setPage] = useState(2);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;
  const chunkData = comment.slice(0, startIndex + PAGE_SIZE);

  return (
    <div className="mb-14  max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8">
      <div className="mt-20">
        <div className="grid grid-cols-6 gap-4 items-center">
          <img
            src="/asset/img.png"
            className="w-8 h-8 rounded-full col-span-1"
          />
          <input
            className="rounded col-span-4 border"
            type="text"
            placeholder="댓글을 남겨보세요."
            onChange={handleInputChange}
          />
          <button
            className="rounded col-span-1  rounded-[4px] text-[14px] font-medium bg-btn-color text-white"
            onClick={handleSaveClick}
          >
            입력
          </button>
        </div>
      </div>

      <div className="mt-10 mb-[100px]">
        {chunkData.map((item, index) => (
          <div key={index} className="mt-10">
            <div className="grid grid-cols-6 gap-4 items-center mb-2">
              <img
                src="/asset/img.png"
                className="w-8 h-8 rounded-full col-span-1"
              />
              <div className="font-bold col-span-3">Lee seeun</div>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  className="text-gray-400 text-sm"
                  onClick={handleEditComment}
                >
                  수정
                </button>
                <button
                  className="text-gray-400 text-sm"
                  onClick={() => handleDeleteComment(index)}
                >
                  삭제
                </button>
              </div>
            </div>
            {iscomment === false ? (
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="w-8 h-8 rounded-full col-span-1"></div>
                <div className="col-span-3">{item}</div>
                <div className="col-span-2 flex justify-end gap-2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4 items-center ml-10">
                <input
                  className="border rounded col-span-3"
                  type="text"
                  placeholder={item}
                  onChange={handleCommentChange}
                />
                <button
                  className="text-gray-400 text-sm col-span-2"
                  onClick={() => handleUpdateComment(index)}
                >
                  저장
                </button>
              </div>
            )}
            <div className="grid grid-cols-6 gap-4 items-center">
              <div className="w-8 h-8 rounded-full col-span-1"></div>
              <div className="col-span-3 text-gray-400 text-sm">
                {commentdate[index]} {currentTime[index]}
              </div>
              <div className="col-span-2 flex justify-end gap-2"></div>
            </div>
          </div>
        ))}
      </div>
      <div ref={ref}>이게 보이면 무한 스크롤</div>
    </div>
  );
}

export default Comment;
