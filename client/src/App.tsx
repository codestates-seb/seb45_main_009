import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePageInd from "./pages/ProfilePage";
// import ProfilePageCor from "./pages/ProfilePageCor";
import OauthLoadingPage from "./pages/OauthLoadingPage";
import AlarmPage from "./pages/Alarmpage";
import MainPageInd from "./pages/MainPageInd";
import FeedDetailPageCor from "./pages/FeedDetailPageCor";
import FeedDetailPageInd from "./pages/FeedDetailPageInd";
import FeedFormPageCor from "./pages/FeedFormPageCor";
import FeedFormPageInd from "./pages/FeedFormPageInd";
import Not404 from "./pages/Not404";
import MainPageCor from "./pages/MainPageCor";
import MyPage from "./pages/MyPage";
import ScrollToTop from "./components/features/ScrollToTop";
import Layout from "./components/atoms/Layout";
import useUserSession from "./hooks/useUserSession";
import FeedUpdataePageInd from "./pages/FeedUpdatePageInd";
import FeedUpdataePageCor from "./pages/FeedUpdatePageCor";
import DmPage from "./pages/DmPage";

import loadingImage from "./assets/images/loading.gif";
import useFetchUserData from "./hooks/useFetchUserData";
import Community from "./pages/Community";
import MyPageFollowing from "./components/atoms/MyPageFollowing";
import MyPageFollower from "./components/atoms/MyPageFollower";
import MyPageFollow from "./components/atoms/MyPageFollow";
import MypageFollow from "./pages/MypageFollow";
import { useInView } from "react-intersection-observer";

function App() {
  const fetchData = useFetchUserData();
  const [ref, inView] = useInView();
  fetchData();
  //새로고침시 로그인 상태 유지 - 완벽하게 상태저장 후 페이지 로드를 위해 로딩 추가
  const isLoading = useUserSession();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <img src={loadingImage} alt="loadingImage" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <ScrollToTop />
        <Layout>
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<MainPageInd />}></Route>
              <Route path="/store" element={<MainPageCor />}></Route>
              <Route
                path="/feeddetailcor/:feedId"
                element={<FeedDetailPageCor />}
              />

              <Route
                path="/feeddetailind/:feedId"
                element={<FeedDetailPageInd />}
              />
              <Route path="/feedformcor" element={<FeedFormPageCor />} />
              <Route path="/feedformind" element={<FeedFormPageInd />} />
              <Route
                path="/feedupdateind/:feedId"
                element={<FeedUpdataePageInd />}
              />
              <Route
                path="/feedupdatecor/:feedId"
                element={<FeedUpdataePageCor />}
              />
              <Route path="/mypage/:page" element={<MyPage />} />
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/signup" element={<SignupPage />}></Route>
              <Route
                path="/profile/:userId"
                element={<ProfilePageInd />}
              ></Route>
              <Route path="/notification" element={<AlarmPage />}></Route>
              <Route path="/community" element={<Community />}></Route>
              <Route path="/directmessage" element={<DmPage />} />
              {/* <Route path="/profilecor/:userId" element={<ProfilePageCor />}></Route> */}

              <Route
                path="/oauthloading"
                element={<OauthLoadingPage />}
              ></Route>
              <Route
                path="/mypage/follow/:page"
                element={<MypageFollow inView={inView} />}
              ></Route>

              {/*               <Route path="/alarmpage" element={<Alarm />}></Route> */}
              <Route path="*" element={<Not404 />} />
            </Routes>
          </main>
        </Layout>
        <div ref={ref}>xxxxx</div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
