import BackButton from "../components/atoms/BackButton";
import { useParams } from 'react-router-dom';
import UserProfile from '../components/atoms/UserProfile';


function ProfilePageInd() {
  const { feedId: feedIdString } = useParams<{ feedId: string }>();

  const feedId = Number(feedIdString) || 0;

  if (!feedId) {
    return <div>Invalid feedId</div>;
  }

  return (
    <div>
      <BackButton />
      <UserProfile  feedId={feedId}/>
    </div>
  );
}

export default ProfilePageInd;
