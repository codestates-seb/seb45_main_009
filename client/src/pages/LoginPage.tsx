import React, { useState } from "react";
import axios from "axios";
import { login } from "../redux/reducers/loginSlice";
import { Link } from "react-router-dom";
import kakao from "../assets/images/kakaotalk.png";

//컴포넌트 불러오기
import CommonInput from "../components/atoms/CommonInput";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { UserInfo } from "../types/types";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //   이메일 값 저장
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");

  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  //   이메일 유효성 검사
  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

  const validateEmailHandler = () => {
    if (emailRegEx.test(email)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };
  const clearEmailValidation = () => {
    setIsValidEmail(null);
  };

  const onSubmitHandler = async () => {
    if (isValidEmail) {
      const url = "http://localhost:8080/login";
      try {
        const response = await axios.post(url, { email, password });

        const accessToken = response.headers["Authorization"];
        const userType = response.headers["Usertype"];
        const userNickname = response.headers["Nickname"];
        const userInfo: UserInfo = { userType, userNickname };

        sessionStorage.setItem("access_token", accessToken);
        const userInfoString = JSON.stringify(userInfo);
        sessionStorage.setItem("user_info", userInfoString);

        dispatch(login({ userInfo }));

        navigate("/");
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  return (
    <div className=" flex justify-center h-3/5 items-center  pt-[20px] mb-[40px] mt-[20px] ">
      <div className="w-[300px] ">
        <CommonInput
          placeholder="이메일을 입력해주세요."
          label="이메일"
          type="email"
          onChange={handleEmailChange}
          onBlur={validateEmailHandler}
          onFocus={clearEmailValidation}
        />
        {isValidEmail === false && (
          <p className="text-[12px] text-isValid-text-red">유효하지 않은 이메일 형식입니다.</p>
        )}

        <CommonInput
          placeholder="비밀번호를 입력해주세요."
          label="비밀번호"
          type="password"
          onChange={handlePasswordChange}
        />

        <button
          onClick={onSubmitHandler}
          className="w-[300px] py-2 rounded-[4px] text-[14px] mt-[25px] font-medium text-white transition bg-sbc hover:bg-sbc-hover"
        >
          로그인
        </button>

        <div className="text-[12px] w-full mt-[10px] flex justify-center  font-medium text-gray-400 mb-[10px]">
          아직 FitFolio의 회원이 아니라면?{" "}
          <Link to="/signup" className="underline ml-1">
            회원가입
          </Link>
        </div>

        <button className="flex flex-row justify-center w-[300px] py-2 rounded-[4px] text-[14px] mt-[20px] font-medium bg-[#f9e000] text-black transition hover:opacity-75">
          <img src={kakao} alt="kakaotalk" className="w-6 h-6" /> KaKao 로그인/회원가입
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
