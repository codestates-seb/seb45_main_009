import React, { useState } from "react";
import { useNavigate } from "react-router";
import CommonInput from "./CommonInput";
import ConfirmButton from "./ConfirmButton";
import globalAxios from "../../data/data";

const ChangePassword = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [isValidPassWord, setIsValidPassword] = useState<boolean | null>(null);
  const [isPasswordsMatch, setIsPasswordsMatch] = useState<boolean | null>(null);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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
  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  //비밀번호 재확인 검사
  const checkPasswordsMatch = () => {
    setIsPasswordsMatch(password === passwordConfirm);
  };
  const clearPasswordsMatchValidation = () => {
    setIsPasswordsMatch(null);
  };
  const handlePasswordSubmit = async () => {
    const formData = new FormData();
    const requestBody = {
      password: password,
    };
    const blob = new Blob([JSON.stringify(requestBody)], {
      type: "application/json",
    });
    formData.append("requestBody", blob);
    try {
      const response = await globalAxios.patch("/mypage/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("비밀번호 수정 성공");
      navigate(-1);
    } catch (error: any) {
      alert(error.response.message);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center mt-20 h-1/2 max-mobile:mt-10">
      <p className="text-2xl font-bold mb-10">비밀번호 변경</p>
      <div className="w-[300px]">
        <CommonInput
          placeholder="비밀번호를 입력해주세요."
          label="새 비밀번호"
          type="password"
          onChange={handlePasswordChange}
          onBlur={validatePasswordHandler}
          onFocus={clearPasswordValidation}
        ></CommonInput>
        <p className="text-[12px]">영문자, 숫자를 혼합하여 8~20자로 입력해주세요.</p>
        {isValidPassWord === false && (
          <p className="text-[12px] text-isValid-text-red">유효하지 않은 비밀번호 형식입니다.</p>
        )}
        <CommonInput
          placeholder="비밀번호를 다시 입력해주세요."
          label="비밀번호 확인"
          type="password"
          onChange={handlePasswordConfirmChange}
          onBlur={checkPasswordsMatch}
          onFocus={clearPasswordsMatchValidation}
          className="mb-4"
        ></CommonInput>
        {isPasswordsMatch === false && (
          <p className="text-[12px] text-isValid-text-red">비밀번호가 일치하지 않습니다.</p>
        )}
        <ConfirmButton label="비밀번호 변경" onClick={handlePasswordSubmit}></ConfirmButton>
        <div className="flex justify-end mt-10 hover:cursor-pointer" onClick={() => navigate(-1)}>
          취소
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
