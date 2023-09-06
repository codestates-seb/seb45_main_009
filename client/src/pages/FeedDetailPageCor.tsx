// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import ProfileCor from "../components/atoms/ProfileCor";
import DetailFeedCor from "../components/atoms/DetailFeedCor";
import Comment from "../components/atoms/Comment";

function FeedDetailPageCor() {
  return (
    <div>
        <BackButton />
        <ProfileCor />
        <div className=" mt-[60px]">
            <DetailFeedCor />
            <Comment />
          </div>
      </div>
  );
}

export default FeedDetailPageCor;
