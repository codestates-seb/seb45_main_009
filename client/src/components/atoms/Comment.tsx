import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import globalAxios from "../../data/data";
import { CommentTypes } from "../../types/types";
import { UserInfo, RootState } from "../../types/types";
import timeFormatter from "../../hooks/timeFormatter";
import defaultImg from "../../assets/images/profileDefault.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootStates } from "../../types/types";
interface CommentProps {
  feedId: number;
  isMyFeed: boolean;
  userInfo: UserInfo;
}

function Comment({ feedId, isMyFeed, userInfo }: CommentProps) {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.login.isAuthenticated
  );
  // 유저 사진 가져오기
  const { allUserDatas } = useSelector((state: RootStates) => state.feed);

  // 전체 유저에서 내 유저 확인

  const isNicknameExist = allUserDatas.some(
    (user) => user.userId === userInfo.userId
  );

  // 사진 가져오기
  let profileImage = "";

  if (isNicknameExist) {
    const matchedUser = allUserDatas.find(
      (user) => user.userId === userInfo.userId
    );

    if (matchedUser && matchedUser.profileimg) {
      profileImage = matchedUser.profileimg;
    }
  }

  const [commentData, setCommentData] = useState<CommentTypes[]>([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [getPage, setGetPage] = useState(1);

  const [ref, inView] = useInView();

  const PAGE_SIZE = 4;

  //댓글 데이터 불러오기
  const getCommentsData = async () => {
    if (loading || !hasMore) {
      return; // 이미 로딩 중이거나 추가 데이터를 더 이상 불러올 필요가 없는 경우 무시
    }
    try {
      setLoading(true);
      const response = await globalAxios.get(
        `/feed/detail/${feedId}/comments`,
        {
          params: { page, pageSize: PAGE_SIZE },
        }
      );
      const getData = response.data;

      // if (page === getData.pageInfo.totalPages) {
      //   return;
      // }

      console.log("댓글 데이터 불러오기 성공", response);
      const updatedCommentData = [...commentData, ...getData.feedCommentData];
      setCommentData(updatedCommentData);
      setPage((prevPage) => prevPage + 1);

      const currentPage = getData.pageInfo.page;
      const totalPages = getData.pageInfo.totalPages;

      setLoading(false);
      if (currentPage >= totalPages) {
        // 현재 페이지가 총 페이지 수보다 크거나 같으면 무한 스크롤 중단
        setHasMore(false);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommentsData();
  }, []);

  useEffect(() => {
    if (inView) {
      getCommentsData();
    }
  }, [inView]);

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
    if (commentInputValue.trim().length === 0) {
      return;
    }
    const formData = new FormData();

    const feedCommentPostDto = {
      content: commentInputValue,
    };

    const blob = new Blob([JSON.stringify(feedCommentPostDto)], {
      type: "application/json",
    });
    formData.append("feedCommentPostDto", blob);

    try {
      const response = await globalAxios.post(
        `/feed/detail/${feedId}/comment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("댓글 등록 성공", response);
      alert("댓글이 등록되었습니다.");
      window.location.reload();

      setCommentInputValue("");
    } catch (error) {
      console.error("Error deleting the comment:", error);
    }
  };

  // 댓글 삭제 !!
  const deleteComment = async (feedCommentId: number) => {
    try {
      const response = await globalAxios.delete(
        `/feed/detail/comment/${feedCommentId}`
      );
      // console.log("댓글 삭제 성공", response);
      // getCommentsTestData();
      alert("댓글이 삭제되었습니다.");
      window.location.reload();
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
      const response = await globalAxios.patch(
        `/feed/detail/comment/${feedCommentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("댓글 수정 성공", response);
      setInputUpdateValue("");
      setEditingCommentId(null);
      getCommentsData();
    } catch (error) {
      console.error("Error updating the comment:", error);
    }
  };

  const handleInputKeyUpSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing === false) handleSaveClick();
    }
  };

  //수정에 넣기
  const handleInputKeyUpUpdate = (
    e: React.KeyboardEvent<HTMLInputElement>,
    feedCommentId: number
  ) => {
    if (e.key === "Enter") {
      handleUpdateComment(feedCommentId);
    }
  };

  const handleNavigateProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="mb-14  max-w-screen-sm mx-auto px-4 sm:px-4 lg:px-8">
      <div className="mt-10">
        <div className="grid grid-cols-[auto,1fr,auto] items-center w-full gap-4">
          <img
            src={profileImage ? profileImage : defaultImg}
            className="w-8 h-8 rounded-full"
            alt="profileImage"
          />

          {isAuthenticated ? (
            <input
              className="border-b focus:outline-none "
              type="text"
              placeholder="댓글을 남겨보세요."
              onChange={handleInputChange}
              onKeyPress={handleInputKeyUpSubmit}
              value={commentInputValue}
            />
          ) : (
            <input
              disabled
              className="border-b focus:outline-none "
              placeholder="로그인이 필요합니다."
            />
          )}

          <button
            className="text-blue-400 text-[14px]"
            onClick={handleSaveClick}
          >
            입력
          </button>
        </div>
      </div>

      <div className="mt-10 mb-[100px]">
        {commentData &&
          commentData.map((comment) => (
            <div key={comment.feedCommentId} className="mt-10">
              <div className="grid grid-cols-[auto,1fr,auto] gap-4">
                <img
                  src={comment.profileImageUrl}
                  className="border w-8 h-8 rounded-full items-start hover:cursor-pointer"
                  alt="profileImage"
                  onClick={() => handleNavigateProfile(comment.userId)}
                />
                {/**댓글 데이터에 userId넣기(지금없음) / handViagete에 userId넣기 */}
                <div className="items-start">
                  <span className="font-medium mr-2">{comment.nickname}</span>
                  <span className="text-[14px] opacity-90">
                    {comment.content}
                  </span>
                </div>

                <div className="w-[40px] sm:w-[30px] text-[13px] text-gray-400 flex items-center items-start">
                  {userInfo.userId === comment.userId ? (
                    <div>
                      {/* <button
                                className="text-[13px] opacity-75"
                                onClick={() => setEditingCommentId(comment.feedCommentId)}
                            >
                                수정
                            </button> */}
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
                    <div></div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[auto,1fr] gap-4 items-center mt-[-2px]">
                <div className="w-8 h-8"></div>
                <div className="text-[13px] opacity-50">
                  {timeFormatter(comment.createdAt)}
                </div>
              </div>

              {/* 댓글 수정 주석처리 */}
              {/* {userInfo.userNickname === comment.nickname ? (
                  <div className="col-span-2 flex justify-end gap-2">
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
                  <div className="col-span-2"></div> 
                )} */}

              {/* {editingCommentId !== comment.feedCommentId ? (
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="w-8 h-8 rounded-full col-span-1 "></div>
                  <div className="col-span-3">{comment.content}</div>
                  <div className="col-span-2 flex justify-end gap-2"></div>
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-4 items-center ">
                  <div className="w-8 h-8 rounded-full col-span-1 "></div>
                  <input
                    className="border rounded col-span-3"
                    type="text"
                    value={inputUpdateValue}
                    placeholder={comment.content}
                    onChange={handleCommentChange}
                    onKeyUp={(e) => handleInputKeyUpUpdate(e, comment.feedCommentId)}
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
                  </div>
                </div>
              )} */}
            </div>
          ))}
      </div>
      <div className="h-1 w-1" ref={ref}></div>
    </div>
  );
}

export default Comment;
