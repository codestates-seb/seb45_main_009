import { useLocation } from "react-router";
import MyPageTop from "./MyPageTop";
import Top from "./Top";
import Up from "./Up";
import { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const isMyPage = location.pathname.includes("/mypage");
  return (
    <>
      {isMyPage ? <MyPageTop /> : <Top />}
      {children}
      <Up />
    </>
  );
};

export default Layout;
