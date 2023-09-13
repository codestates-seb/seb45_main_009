import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import globalAxios from '../../data/data'

interface CommentProps {
  feedId: number;
}


function Comment({ feedId }: CommentProps) {
  interface Comment {
    feedCommentId: number;
    feedId: number;
    content: string;
    userNickname: string;
    createdAt: string;
    modifiedAt: string;
  }
  
  interface PageInfo {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }
  
  interface CommentData {
    feedCommentData: Comment[];
    pageInfo: PageInfo;
  }

  const [commentData, setCommentData] = useState<CommentData | null>(null);

  const fetchCommentData = async () => {
    try {
      const response = await globalAxios.get(`/feed/detail/${feedId}/comments`);
      if (response.status === 200) {
        setCommentData(response.data);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  }

  useEffect(() => {
    fetchCommentData();
  }, []);

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

  let userInfo: any = null;

  const userInfoString = sessionStorage.getItem('user_info');
  if (userInfoString) {
      userInfo = JSON.parse(userInfoString);
  }

  // 댓글 등록!!
  // const handleSaveClick = async () => {
  //   console.log("댓글등록 버튼 클릭");

  //   const accessToken = sessionStorage.getItem('access_token');

  //   try {
  //     const response =  globalAxios.post(`/feed/detail/${feedId}/comment`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `${accessToken}`,
  //       },
  //     });
  //     console.log("결과",response)
  //     console.log("댓글 입력시 가는 데이터", JSON.stringify(feedCommentPostDto))

  //   } catch (error) {
  //     console.error("Error saving the comment:", error);
  //   }


  // };

  function getCurrentDateTimeFormatted(): string {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const period = hours >= 12 ? '오후' : '오전';
  
    return `${year}. ${month}. ${day}. ${period} ${hours % 12 || 12}:${minutes}:${seconds}`;
  }
  const commentdate = getCurrentDateTimeFormatted();
  console.log("등록 날짜",commentdate)


  const handleSaveClick = async () => {
    const accessToken = sessionStorage.getItem('access_token');
    // const currentDateTime = getCurrentDateTimeFormatted();


   const formData = new FormData();

   const feedCommentPostDto = {
     "feedCommentId": 6,
     "feedId": feedId,
     "content": commentInputValue,
     "userNickname": userInfo ? userInfo.userNickname : "",
     "createdAt": commentdate,
     "modifiedAt": commentdate,
   };

   const blob = new Blob([JSON.stringify(feedCommentPostDto)], {
     type: "application/json",
   });
   formData.append("feedCommentPostDto", blob);

    try {
      const response = await globalAxios.post(`/feed/detail/${feedId}/comment`,formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${accessToken}`,
        },
        });
      if (response.status === 200) {
        fetchCommentData();  
      }
    } catch (error) {
      console.error("Error deleting the comment:", error);
    }
  }

  
  // 댓글 삭제 
  const deleteComment = async (feedCommentId: number) => {
    const accessToken = sessionStorage.getItem('access_token');
    try {
      const response = await globalAxios.delete(`http://13.125.146.181:8080/feed/detail/comment/${feedCommentId}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });
  
      if (response.status === 200) {
        fetchCommentData();  
      }
    } catch (error) {
      console.error("Error deleting the comment:", error);
    }
  }


  const [page, setPage] = useState(2);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);
  const PAGE_SIZE = 4;
  const startIndex = (page - 1) * PAGE_SIZE;


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
      {commentData && commentData.feedCommentData.map((comment, index) => (
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
                onClick={() => {
                  deleteComment(comment.feedCommentId);
                }}
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