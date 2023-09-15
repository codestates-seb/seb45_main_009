// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import ProfileCor from "../components/atoms/ProfileCor";
import DetailFeed from "../components/atoms/DetailFeed";
import Comment from "../components/atoms/Comment";
import { useParams } from "react-router-dom";

function FeedDetailPageInd() {
  const { feedId: feedIdString } = useParams<{ feedId: string }>();

  const feedId = Number(feedIdString) || 0;

  if (!feedId) {
    return <div>Invalid feedId</div>;
  }

  return (
    <div>
      <BackButton />
      <ProfileCor feedId={feedId} />
      <div className=" mt-[60px]">
        <DetailFeed feedId={feedId} />
        <Comment feedId={feedId} />
      </div>
    </div>
  );
}

export default FeedDetailPageInd;
