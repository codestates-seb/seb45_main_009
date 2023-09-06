import React, { useState } from "react";
import axios from "axios";
//컴포넌트 불러오기
import CommonInput from "../components/atoms/CommonInput";
import MembershipButtonGroup from "../components/atoms/MembershipButtonGroup";

function Login() {
  const handleMembershipChange = (type: "개인회원" | "기업회원") => {
    console.log(`선택된 회원 유형: ${type}`);
  };

  //   이메일 값 저장
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");

  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);
  const [isValidPw, setIsValidPassword] = useState<boolean | null>(null);

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

  // 비밀번호 유효성 검사
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
  const validatePasswordHandler = () => {
    if (passwordRegEx.test(password)) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
  };
  const clearPasswordValidation = () => {
    setIsValidPassword(null);
  };

  const onSubmitHandler = async () => {
    if (isValidEmail && isValidPw) {
      const url = "URL";
      try {
        const response = await axios.post(url, { email, password });
        alert("회원가입 성공");
      } catch (error) {
        //에러 처리 로직..
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className=" flex justify-center pt-[20px] mb-[40px]  h-4/6 items-center ">
      <div className="w-[300px]">
        <MembershipButtonGroup onChange={handleMembershipChange} />

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
          onBlur={validatePasswordHandler}
          onFocus={clearPasswordValidation}
        />
        <p className="text-[12px]">영문자, 숫자를 혼합하여 8~20자로 입력해주세요.</p>
        {isValidPw === false && <p className="text-[12px] text-isValid-text-red">비밀번호 형식을 확인해주세요.</p>}

        <CommonInput placeholder="닉네임을 입력해주세요." label="닉네임" type="text" />
        <CommonInput placeholder="이름을 입력해주세요." label="이름" type="text" />
        <CommonInput placeholder="" label="생년월일" type="date" />
        <div className="flex justify-center mt-[20px]">
          <input id="남자" value="남자" name="gender" type="radio" />
          남자
          <input className="ml-[10px]" id="여자" value="여자" name="gender" type="radio" />
          여자
        </div>

        <button
          type="submit"
          onClick={onSubmitHandler}
          className="w-[300px] py-2 rounded-[4px] text-[14px] mt-[20px] font-medium transition bg-sbc hover:bg-sbc-hover text-white"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
