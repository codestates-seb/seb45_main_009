import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResponseDataType } from "../types/types";
import globalAxios from "../data/data";
// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import ProfileInd from "../components/atoms/ProfileInd";
import DetailFeed from "../components/atoms/DetailFeed";
import Comment from "../components/atoms/Comment";

function FeedDetailPageInd() {
  const { feedId: feedIdString } = useParams<{ feedId: string }>();

  const feedId = Number(feedIdString) || 0;
  // 피드데이터 가져오기
  const [responseData, setResponseData] = useState<ResponseDataType | null>(null);
  useEffect(() => {
    async function fetcFeedData() {
      try {
        const response = await globalAxios.get(`/feed/detail/${feedId}`);
        if (response.status === 200) {
          setResponseData(response.data);
        }
      } catch (error) {
        console.error("피드 디테일 get 요청 실패:", error);
      }
    }
    fetcFeedData();
  }, []);

  if (!feedId) {
    return <div>Invalid feedId</div>;
  }

  return (
    <div>
      <BackButton />
      <ProfileInd feedId={feedId} responseData={responseData} />
      <div className=" mt-[60px]">
        <DetailFeed feedId={feedId} responseData={responseData} />
        <Comment feedId={feedId} />
      </div>
    </div>
  );
}

export default FeedDetailPageInd;
