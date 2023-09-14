// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import ProfileCor from "../components/atoms/ProfileCor";
import DetailFeedCor from "../components/atoms/DetailFeedCor";
import Comment from "../components/atoms/Comment";
import { useParams } from "react-router-dom";


function FeedDetailPageCor() {
  const { feedId: feedIdString } = useParams<{ feedId: string }>();

  const feedId = Number(feedIdString) || 0;

  if (!feedId) {
    return <div>Invalid feedId</div>;
  }

  return (
    <div>
        <BackButton />
        <ProfileCor />
        <div className=" mt-[60px]">
            <DetailFeedCor />
            <Comment feedId={feedId} />
        </div>
      </div>
  );
}

export default FeedDetailPageCor;
