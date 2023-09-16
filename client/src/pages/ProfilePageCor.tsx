import BackButton from "../components/atoms/BackButton";
import { useParams } from 'react-router-dom';
import UserProfileCor from '../components/atoms/UserProfileCor';

function ProfilePageCor() {
  const { userId: userIdString } = useParams<{ userId: string }>();

  const userId = Number(userIdString) || 0;

  if (!userId) {
    return <div>Invalid userId</div>;
  }

  return (
    <div>
      <BackButton />
      <UserProfileCor userId={userId}/>
    </div>
  );
}

export default ProfilePageCor;