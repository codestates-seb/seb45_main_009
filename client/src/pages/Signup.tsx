import React, { useState } from "react";

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
  const [isValidPw, setIsValidPw] = useState<boolean | null>(null);

  //   이메일 유효성 검사
  const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;

  // 비밀번호 유효성 검사
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // 이메일 형식 검증
    if (emailRegEx.test(newEmail)) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };

  const onPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nePw = e.target.value;
    setPassword(nePw);

    // 비밀번호 검증
    if (passwordRegEx.test(nePw)) {
      setIsValidPw(true);
    } else {
      setIsValidPw(false);
    }
  };

  const onSubmitHandler = () => {
    console.log("회원가입 시도");
  };

  return (
    <div className=" flex justify-center pt-[20px] mb-[40px]">
      <div className="w-[300px]">
        <MembershipButtonGroup onChange={handleMembershipChange} />

        <CommonInput placeholder="이메일을 입력해주세요." label="이메일" type="email" onChange={handleEmailChange} />
        {isValidEmail === null ? null : isValidEmail ? null : (
          <p className="text-[12px] text-isValid-text-red">유효하지 않은 이메일 형식입니다.</p>
        )}

        <CommonInput placeholder="비밀번호를 입력해주세요." label="비밀번호" type="text" onChange={onPasswordHandler} />
        <p className="text-[12px]">영문 대문자, 숫자를 혼합하여 8~20자로 입력해주세요.</p>
        {isValidPw === null ? null : isValidPw ? null : (
          <p className="text-[12px] text-isValid-text-red">비밀번호 형식을 확인해주세요.</p>
        )}

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
          className="w-[300px] h-[30px] rounded-[4px] text-[14px] mt-[20px] font-medium bg-btn-color text-white"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
