import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type CommentData = {
  feedCommentId: number;
  feedId: number;
  content: string;
  userNickname: string;
  createdAt: string;
  modifiedAt: string;
};

type PageInfo = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type CommentsDataType = {
  feedCommentData: CommentData[];
  pageInfo: PageInfo;
};


function Comment() {
  // 댓글생성
  const [commentInputValue, setCommentInputValue] = useState<string>("");
  const [comment, setComment] = useState<string[]>(["멋있어요"]);


  const [iscomment, setIsComment] = useState(false);
  const [inputUpdateValue, setInputUpdateValue] = useState<string>("");

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUpdateValue(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInputValue(event.target.value);
  };

  const handleEditComment = () => {
    setIsComment(true);
  };
  const handleUpdateComment = (index: number) => {
    comment[index] = inputUpdateValue;
    setIsComment(false);
  };

  // 댓글 등록!!
  const handleSaveClick = async () => {
    console.log("댓글등록 버튼 클릭")
  };
  
  // const handleSaveClick = async () => {

  //   const accessToken = sessionStorage.getItem('Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlcyI6WyJVU0VSIl0sInVzZXJJZCI6MTEsImVtYWlsIjoibHNlMDUyMkBnbWFpbC5jb20iLCJzdWIiOiJsc2UwNTIyQGdtYWlsLmNvbSIsImlhdCI6MTY5NDUxNzM3NiwiZXhwIjoxNjk0NTI0NTc2fQ.FLTGUeqW6l6DO26BZSKpcGkIKW2QDHZZq3sI7GRVMrAYhcOWT9i2SO4522Epa6a3');
  //   try {
  //     const response = await fetch('http://13.125.146.181:8080/feed/detail/8/comment', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `${accessToken}`,
  //       },
  //       body: JSON.stringify({
  //           "content": commentInputValue,
  //       })
  //     });
  
  //     const responseData = await response.json();
  //     setComments(prevComments => [...prevComments, responseData]);
  
  //     console.log("댓글이 성공적으로 저장되었습니다.");
  //     comments.forEach((comment, index) => {
  //       console.log(`댓글 ${index}:`, comment);
  //     });
  
  //   } catch (error) {
  //     console.error("댓글 저장 중 에러 발생:", error);
  //   }
  // };

  const handleDeleteComment = (index: number) => {
    console.log("삭제버튼 클릭");
    console.log(index);
    const newdelete = [...comment];
    newdelete.splice(index, 1);
    setComment(newdelete);
  };

  const [page, setPage] = useState(2);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;


    // 댓글 업데이트
    const feedid = 8;
    
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // const accessToken = sessionStorage.getItem("access_token");
      // console.log(accessToken)
      try {
        const response = await fetch(`http://13.125.146.181:8080/feed/detail/${feedid}/comments`);
        const data: CommentsDataType = await response.json();
        setComments(data.feedCommentData);
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    };
    
    fetchData();
  }, []);


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
        {comments.map((comment, index) => (
          <div key={comment.feedCommentId} className="mt-10">
            <div className="grid grid-cols-6 gap-4 items-center mb-2">
              <img
                src="/asset/img.png"
                className="w-8 h-8 rounded-full col-span-1"
              />
              <div className="font-bold col-span-3">{comment.userNickname}</div>
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
                <div className="col-span-3">{comment.content}</div>
                <div className="col-span-2 flex justify-end gap-2"></div>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4 items-center ml-10">
                <input
                  className="border rounded col-span-3"
                  type="text"
                  placeholder={comment.content}
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
        {new Date(comment.createdAt).toLocaleString()}
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
