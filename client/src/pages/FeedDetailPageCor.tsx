import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResponseDataType, RootState } from "../types/types";
import globalAxios from "../data/data";
import { useDispatch, useSelector } from "react-redux";
// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import ProfileInd from "../components/atoms/ProfileInd";
import DetailFeed from "../components/atoms/DetailFeed";
import Comment from "../components/atoms/Comment";

function FeedDetailPageCor() {
  const { feedId: feedIdString } = useParams<{ feedId: string }>();
  const feedId = Number(feedIdString) || 0;

  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.login.userInfo);

  const [isMyFeed, setIsMyFeed] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<ResponseDataType | null>(null);
  // 피드데이터 가져오기
  useEffect(() => {
    async function fetcFeedData() {
      try {
        const response = await globalAxios.get(`/feed/detail/${feedId}`);
        setResponseData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("피드 디테일 get 요청 실패:", error);
      }
    }
    fetcFeedData();
  }, []);
  //유저판별
  useEffect(() => {
    if (userInfo.userId === responseData?.userId) {
      setIsMyFeed(true);
    } else {
      setIsMyFeed(false);
    }
  }, [responseData]);
  useEffect(() => console.log(isMyFeed), [isMyFeed]);
  if (!feedId) {
    return <div>Invalid feedId</div>;
  }

  return (
    <div>
      <BackButton />
      <ProfileInd feedId={feedId} responseData={responseData} userInfo={userInfo} isMyFeed={isMyFeed} />
      <div className=" mt-2">
        <DetailFeed feedId={feedId} responseData={responseData} userInfo={userInfo} isMyFeed={isMyFeed} />
        <Comment feedId={feedId} userInfo={userInfo} isMyFeed={isMyFeed} />
      </div>
    </div>
  );
}

export default FeedDetailPageCor;
