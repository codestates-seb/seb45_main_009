// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import ProfileInd from "../components/atoms/ProfileInd";
import DetailFeed from "../components/atoms/DetailFeed";
import Comment from "../components/atoms/Comment";

function FeedDetailPageInd() {
  return (
    <div>
        <BackButton />
        <ProfileInd />
        <div className=" mt-[60px]">
            <DetailFeed />
            <Comment />
        </div>
      </div>
  );
}

export default FeedDetailPageInd;