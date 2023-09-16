import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/sharedlayout/Header";
import Footer from "./components/sharedlayout/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePageInd from "./pages/ProfilePage";
// import ProfilePageCor from "./pages/ProfilePageCor";
import OauthLoadingPage from "./pages/OauthLoadingPage";
// import Alarm from "./pages/alarmpage";

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

function App() {
  useUserSession();

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
              <Route path="/feeddetailcor/:feedId" element={<FeedDetailPageCor />} />

              <Route path="/feeddetailind/:feedId" element={<FeedDetailPageInd />} />
              <Route path="/feedformcor" element={<FeedFormPageCor />} />
              <Route path="/feedformind" element={<FeedFormPageInd />} />
              <Route path="/feedupdateind/:feedId" element={<FeedUpdataePageInd />} />
              <Route path="/feedupdatecor/:feedId" element={<FeedUpdataePageCor />} />
              <Route path="/mypage/:page" element={<MyPage />} />
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/signup" element={<SignupPage />}></Route>
              <Route path="/profile/:userId" element={<ProfilePageInd />}></Route>
              {/* <Route path="/profilecor/:userId" element={<ProfilePageCor />}></Route> */}
              <Route
                path="/oauthloading"
                element={<OauthLoadingPage />}
              ></Route>
{/*               <Route path="/alarmpage" element={<Alarm />}></Route> */}
              <Route path="*" element={<Not404 />} />
            </Routes>
          </main>
        </Layout>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
