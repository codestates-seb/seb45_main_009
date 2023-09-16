import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import globalAxios from "../../data/data";
import { CommentDataTypes } from "../../types/types";
import { UserInfo } from "../../types/types";
import timeFormatter from "../../hooks/timeFormatter";

interface CommentProps {
  feedId: number;
  isMyFeed: boolean;
  userInfo: UserInfo;
}

function Comment({ feedId, isMyFeed, userInfo }: CommentProps) {
  const [commentData, setCommentData] = useState<CommentDataTypes | null>(null);

  //댓글 데이터 불러오기
  const getCommentsData = async () => {
    try {
      const response = await globalAxios.get(`/feed/detail/${feedId}/comments`);
      console.log("댓글 데이터 불러오기 성공", response);
      setCommentData(response.data);
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  useEffect(() => {
    getCommentsData();
  }, []);

  // 댓글생성
  const [commentInputValue, setCommentInputValue] = useState<string>("");
  const [iscomment, setIsComment] = useState(false);

  // 댓글 수정한 값 저장
  const [inputUpdateValue, setInputUpdateValue] = useState<string>("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUpdateValue(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInputValue(event.target.value);
  };

  const handleEditComment = () => {
    setIsComment(true);
  };

  // 댓글 등록 !!
  const handleSaveClick = async () => {
    const formData = new FormData();

    const feedCommentPostDto = {
      content: commentInputValue,
    };

    const blob = new Blob([JSON.stringify(feedCommentPostDto)], {
      type: "application/json",
    });
    formData.append("feedCommentPostDto", blob);

    try {
      const response = await globalAxios.post(`/feed/detail/${feedId}/comment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("댓글 등록 성공", response);
      setCommentInputValue("");
      getCommentsData();
    } catch (error) {
      console.error("Error deleting the comment:", error);
    }
  };

  // 댓글 삭제 !!
  const deleteComment = async (feedCommentId: number) => {
    try {
      const response = await globalAxios.delete(`/feed/detail/comment/${feedCommentId}`);
      console.log("댓글 삭제 성공", response);
      getCommentsData();
    } catch (error) {
      console.error("Error deleting the comment:", error);
    }
  };

  //댓글 수정
  const handleUpdateComment = async (feedCommentId: number) => {
    const formData = new FormData();

    const feedCommentPatchDto = {
      content: inputUpdateValue,
    };

    const blob = new Blob([JSON.stringify(feedCommentPatchDto)], {
      type: "application/json",
    });
    formData.append("feedCommentPatchDto", blob);

    try {
      const response = await globalAxios.patch(`/feed/detail/comment/${feedCommentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("댓글 수정 성공", response);
      setInputUpdateValue("");
      setEditingCommentId(null);
      getCommentsData();
    } catch (error) {
      console.error("Error updating the comment:", error);
    }
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

  const handleInputKeyUpSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveClick();
    }
  };

  //수정에 넣기
  const handleInputKeyUpUpdate = (e: React.KeyboardEvent<HTMLInputElement>, feedCommentId: number) => {
    if (e.key === "Enter") {
      handleUpdateComment(feedCommentId);
    }
  };

  return (
    <div className="mb-14  max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8">
      <div className="mt-10">
        <div className="flex flex-row w-full">
          <img src="/asset/img.png" className="w-8 h-8 rounded-full mr-6" alt="profileImage" />
          <input
            className="grow border-b focus:outline-none mr-4"
            type="text"
            placeholder="댓글을 남겨보세요."
            onChange={handleInputChange}
            onKeyUp={handleInputKeyUpSubmit}
          />
          <button className="text-blue-400 text-[14px]" onClick={handleSaveClick}>
            입력
          </button>
        </div>
      </div>

      <div className="mt-10 mb-[100px]">
        {commentData &&
          commentData.feedCommentData.map((comment) => (
            <div key={comment.feedCommentId} className="mt-10">
              <div className="flex space-x-4 p-2">
                <img src="/asset/img.png"  className=" w-8 h-8 rounded-full"  alt="profileImage" />
                <div className="flex-grow flex flex-col">
                  <div className="flex items-center space-x-2">
                    {/* <span className="font-bold text-sm">username</span> */}
                      {editingCommentId !== comment.feedCommentId ? (
                        <div className="text-sm">
                          <span className="font-bold text-sm mr-2 ">username</span>
                          
                          {comment.content}
                          <div className="text-[12px] text-gray-400 flex ">
                            {timeFormatter(comment.createdAt)}
                          </div>
                        </div>
                    ) : (
                      <div className="grid grid-cols-6 gap-4 items-center ">
                        {/* <div className="w-8 h-8 rounded-full col-span-1 "></div>
                        <input
                          className="border rounded col-span-3"
                          type="text"
                          placeholder={comment.content}
                          onChange={handleCommentChange}
                        />
                        <div className="flex flex-row justify-end">
                          <button
                            className="text-[13px] opacity-75"
                            onClick={() => handleUpdateComment(comment.feedCommentId)}
                          >
                            저장
                          </button>
                          <button className="text-[13px] opacity-75" onClick={() => setEditingCommentId(null)}>
                            취소
                          </button>
                        </div> */}
                      </div>
                )}
                {userInfo.userNickname === comment.userNickname ? (// 이 부분을 조건부 렌더링으로 추가
                  <div className="flex">
                    <button
                      className="text-[13px] opacity-75"
                      onClick={() => setEditingCommentId(comment.feedCommentId)}
                    >
                      수정
                    </button>
                    <button
                      className="text-[13px] opacity-75"
                      onClick={() => {
                        deleteComment(comment.feedCommentId);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ) : (
                  <div className="col-span-2"></div> // 같지 않으면 아무 것도 보이지 않게 처리
                )}
              </div>
              </div>
              {/* 삭제버튼 */}
              <div className=" flex justify-end">
              <button
                      className="text-[13px] w-[30px] text-gray-400"
                      onClick={() => {
                        deleteComment(comment.feedCommentId);
                      }}
                      >
                      삭제
                    </button>
                      </div>
      </div>
    </div>
))}
      <div ref={ref}>이게 보이면 무한 스크롤</div>
    </div>
    </div>

  );
}

export default Comment;