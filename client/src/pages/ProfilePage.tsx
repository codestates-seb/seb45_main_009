import BackButton from "../components/atoms/BackButton";
import { useParams } from 'react-router-dom';
import UserProfile from '../components/atoms/UserProfile';
import { useState, useEffect } from "react";
import { RootState } from "../types/types";
import { useSelector } from "react-redux";



function ProfilePageInd() {
  const { feedId: feedIdString } = useParams<{ feedId: string }>();
  const feedId = Number(feedIdString) || 0;

  
  const { userId: userIdString } = useParams<{ userId: string }>();
  const userId = Number(userIdString) || 0;

  const userInfo = useSelector((state: RootState) => state.login.userInfo);
  
  console.log(userInfo.userId , userId)
  

  const [isMyFeed, setIsMyFeed] = useState<boolean>(false);

  useEffect(() => {
    if (userInfo.userId === userId) {
      setIsMyFeed(true);
    } else {
      setIsMyFeed(false);
    }
  }, []);

  useEffect(() => console.log(isMyFeed), [isMyFeed]);

  return (
    <div>
      <BackButton />
      <UserProfile userId={userId} isMyFeed={isMyFeed} myid={userInfo.userId}/>
    </div>
  );
}

export default ProfilePageInd;