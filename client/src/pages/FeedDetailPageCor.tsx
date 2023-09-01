// 컴포넌트 가져오기
import BackButton from '../components/atoms/BackButton';
import ProfileCor from '../components/atoms/ProfileCor';


function FeedDetailPageCor() {
  return (
    <div className="w-full p-10">
      <BackButton />
      <div className="w-full pl-10  flex-left">
        <ProfileCor />
      </div>
    </div>
  );
}

export default FeedDetailPageCor;
