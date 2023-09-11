import React, { useState } from "react";
import { useNavigate } from "react-router";

interface ChangePasswordProps {
  password: string;
  confirmPassword: string;
}

// 비밀번호 검사 함수
const isPasswordValid = (password: string) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
};

const ChangePassword = () => {
  const [formData, setFormData] = useState<ChangePasswordProps>({
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });

    if (!isPasswordValid(newPassword)) {
      setErrorMessage(
        "비밀번호는 8자 이상이며, 영문, 숫자를 반드시 1자 이상 포함해야 합니다."
      );
    } else {
      setErrorMessage("");
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword: newConfirmPassword });

    if (newConfirmPassword !== formData.password) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMessage("");
    }
  };

  const handlePasswordSubmit = () => {
    if (!isPasswordValid(formData.password)) {
      setErrorMessage(
        "비밀번호는 8자 이상이며, 영문, 숫자를 반드시 1자 이상 포함해야 합니다."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    setFormData({ password: "", confirmPassword: "" });
    setErrorMessage("");
    navigate(-1);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center mt-10 h-1/2">
      <div className="flex flex-col">
        <p className="text-3xl font-bold mb-10">비밀번호 변경</p>

        <p className="text-xl font-bold mb-5">새 비밀번호</p>
        <input
          type="password"
          className="border rounded-lg p-3 mb-4 text-xs min-w-[320] sm:text-base"
          placeholder="영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요."
          value={formData.password}
          onChange={handlePasswordChange}
        />
        <p className="text-xl font-bold mb-5">비밀번호 확인</p>
        <input
          type="password"
          className="border rounded-lg p-3 mb-4 text-xs sm:text-base"
          value={formData.confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button
          className="border rounded-lg p-3 my-5 bg-modify-btn-color hover:text-white  text-xs sm:text-base"
          onClick={handlePasswordSubmit}
          disabled={!!errorMessage}
        >
          비밀번호 변경
        </button>
        <div
          className="flex justify-end text-red-500 mt-10 hover:cursor-pointer"
          onClick={() => navigate(-1)}
        >
          취소
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
