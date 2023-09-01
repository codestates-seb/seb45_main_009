// 컴포넌트 가져오기
import BackButton from "../components/atoms/BackButton";
import ProfileCor from "../components/atoms/ProfileCor";
import DetailFeedCor from "../components/atoms/DetailFeedCor";
import Comment from "../components/atoms/Comment";



function FeedDetailPageCor() {
  return (
    <div className="w-full p-10">
      <BackButton />
      <ProfileCor />
      <div className="w-full pl-10  flex-left">
        <div className=" mt-[60px] flex justify-center">
        <div>
            <DetailFeedCor />
            <Comment />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedDetailPageCor;
