import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { login } from "../redux/reducers/loginSlice";
import { useDispatch } from "react-redux";
import { UserInfo } from "../types/types";
import loading from "../assets/images/loading.gif";

const OauthLoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOAuthKakao = async (code: string) => {
    try {
      //카카오에서 토큰 가져오기
      const kakaoTokenResponse = await axios.post(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&code=${code}&client_secret=${process.env.REACT_APP_KAKAO_CLIENT_SECRET}`,
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      //카카오에서 데이터 가져오기
      const kakaoUserInfoResponse = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${kakaoTokenResponse.data.access_token}`,
        },
      });
      const kakaoemail = kakaoUserInfoResponse.data.kakao_account.email;
      const kakaoimg = kakaoUserInfoResponse.data.properties.profile_image;
      if (!kakaoemail) {
        alert("이메일 제공에 동의를 하시지 않으면 로그인이 불가능합니다.");
        window.location.href = "/login";
      } else {
        //서버로 정보 보내기
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/oauthloading`, {
          email: kakaoemail,
          profileimg: kakaoimg,
        });

        //서버에서 정보 받아서 저장-자체 로그인과 동일
        const accessToken = response.headers["authorization"];
        const rolesString = response.headers["roles"];
        const userType = rolesString.slice(1, -1);
        const userNickname = response.headers["nickname"];
        const userInfo: UserInfo = { userType, userNickname };
        sessionStorage.setItem("access_token", accessToken);
        const userInfoString = JSON.stringify(userInfo);
        sessionStorage.setItem("user_info", userInfoString);

        dispatch(login({ userInfo }));

        navigate("/");
      }
    } catch (error) {
      console.error("OAuth login error:", error);
      alert("로그인에 실패했습니다. 다시 시도해주세요.");
      navigate("/login");
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    if (code) {
      handleOAuthKakao(code);
    }
  }, [location]);

  return (
    <div className="flex justify-center items-center h-screen">
      <img src={loading} alt="loading" />
    </div>
  );
};

export default OauthLoadingPage;
