import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

interface FormData {
  introduction: string;
  nickname: string;
  phoneNumber: string;
  birthdate: string;
  height: string;
  weight: string;
  primarySport: string;
  gender: string;
}

const MyPageEditInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    introduction: "",
    nickname: "",
    phoneNumber: "",
    birthdate: "",
    height: "",
    weight: "",
    primarySport: "",
    gender: "",
  });

  const [previousData, setPreviousData] = useState<FormData>({
    introduction: "",
    nickname: "",
    phoneNumber: "",
    birthdate: "",
    height: "",
    weight: "",
    primarySport: "",
    gender: "",
  });

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
      setPreviousData(parsedData);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    localStorage.setItem("formData", JSON.stringify(formData));
    alert("변경된 정보가 저장되었습니다.");
    navigate("/");
  };

  const handleUndo = () => {
    setFormData(previousData);
  };

  return (
    <div className="flex justify-center flex-col items-center my-12">
      <div className="w-[200px] h-[200px] rounded-full bg-gray-400 mb-10">
        <div className="w-[200px] h-[200px] rounded-full bg-gray-400 mb-10 flex justify-center items-center text-xl">
          +
        </div>
      </div>

      <div className="flex flex-col w-1/4">
        <label htmlFor="introduction">자기소개 수정</label>
        <TextareaAutosize
          id="introduction"
          cacheMeasurements
          placeholder="자기소개 수정"
          maxLength={150}
          name="introduction"
          value={formData.introduction}
          onChange={handleInputChange}
          className="border rounded-lg p-3 my-4 h-full"
        ></TextareaAutosize>

        <label htmlFor="nickname">닉네임 수정</label>
        <input
          type="text"
          id="nickname"
          placeholder="닉네임 수정"
          name="nickname"
          value={formData.nickname}
          onChange={handleInputChange}
          className="border rounded-lg p-3 my-4"
        ></input>

        <label htmlFor="phoneNumber">핸드폰 번호</label>
        <input
          type="number"
          id="phoneNumber"
          placeholder="핸드폰 번호"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="border rounded-lg p-3 my-4"
        ></input>

        <label htmlFor="birthdate">생년월일</label>
        <input
          type="date"
          id="birthdate"
          placeholder="생년월일"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleInputChange}
          className="border rounded-lg p-3 my-4"
        ></input>

        <label htmlFor="height">키 수정</label>
        <input
          type="number"
          id="height"
          placeholder="키 수정"
          name="height"
          value={formData.height}
          onChange={handleInputChange}
          className="border rounded-lg p-3 my-4"
        ></input>

        <label htmlFor="weight">몸무게 수정</label>
        <input
          type="number"
          id="weight"
          placeholder="몸무게 수정"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          className="border rounded-lg p-3 my-4"
        ></input>

        <label htmlFor="primarySport">주 운동 종목</label>
        <input
          type="text"
          id="primarySport"
          placeholder="주 운동 종목"
          name="primarySport"
          value={formData.primarySport}
          onChange={handleInputChange}
          className="border rounded-lg p-3 my-4"
        ></input>
        <div className="flex justify-around my-3">
          <div className="flex">
            <input id="남자" value="남자" name="gender" type="radio" />
            <p>남자</p>
          </div>
          <div className="flex">
            <input
              className="ml-[10px]"
              id="여자"
              value="여자"
              name="gender"
              type="radio"
            />
            <p>여자</p>
          </div>
        </div>
        <div className="flex justify-center my-3">
          <button
            className="px-6 py-2 rounded-xl mb-5 bg-modify-btn-color hover:text-white mr-5"
            onClick={handleSaveChanges}
          >
            수정하기
          </button>
          <button
            className="px-6 py-2 rounded-xl mb-5 bg-modify-btn-color hover:text-white"
            onClick={handleUndo}
          >
            되돌리기
          </button>
        </div>
        <Link to={"/mypage/changepassword"}>
          <div className="flex items-center mb-4">비밀번호 변경 {" -> "}</div>
        </Link>
        <Link to={"/mypage/withdraw"}>
          <div className=" flex justify-end text-red-500">회원 탈퇴</div>
        </Link>
      </div>
    </div>
  );
};

export default MyPageEditInfo;
