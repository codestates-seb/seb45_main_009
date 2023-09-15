import BackButton from "../components/atoms/BackButton";
import { useParams } from 'react-router-dom';
import UserProfile from '../components/atoms/UserProfile';

function ProfilePageInd() {
  const { userId: userIdString } = useParams<{ userId: string }>();

  const userId = Number(userIdString) || 0;

  if (!userId) {
    return <div>Invalid userId</div>;
  }

  console.log("개인");

  return (
    <div>
      <BackButton />
      <UserProfile userId={userId}/>
    </div>
  );
}

export default ProfilePageInd;