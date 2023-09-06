import React from "react";
import MyPageTop from "../components/atoms/MyPageTop";
import Up from "../components/atoms/Up";
import MyPageFeed from "../components/atoms/MyPageFeed";
import MyPageFollow from "../components/atoms/MyPageFollow";
import MyPageEditInfo from "../components/atoms/MyPageEditInfo";
import { useParams } from "react-router";
import ChangePassword from "../components/atoms/ChangePassword";
import Withdraw from "../components/atoms/Withdraw";

const MyPage = () => {
  const { page } = useParams();

  return (
    <div>
      <MyPageTop />
      {page === "feed" && <MyPageFeed />}
      {page === "follow" && <MyPageFollow />}
      {page === "edit" && <MyPageEditInfo />}
      {page === "changepassword" && <ChangePassword />}
      {page === "withdraw" && <Withdraw />}

      <Up />
    </div>
  );
};

export default MyPage;
