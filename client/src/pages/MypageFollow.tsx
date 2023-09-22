import React from "react";
import { useParams } from "react-router";
import MyPageFollower from "../components/atoms/MyPageFollower";
import MyPageFollowing from "../components/atoms/MyPageFollowing";

interface MyPageFollowerProps {
  inView: boolean;
}

const MypageFollow: React.FC<MyPageFollowerProps> = ({ inView }) => {
  const { page } = useParams();
  return (
    <>
      {page === "follower" && <MyPageFollower inView={inView} />}
      {page === "following" && <MyPageFollowing inView={inView} />}
    </>
  );
};

export default MypageFollow;
