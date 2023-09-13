import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
//컴포넌트 불러오기
import CommonInput from "../components/atoms/CommonInput";
import MembershipButtonGroup from "../components/atoms/MembershipButtonGroup";
import SignupAddition from "../components/features/SinupAddition";

interface ImageData {
  file: File | null;
  src: string;
}

function SignupPage() {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<"개인회원" | "기업회원">("개인회원");
  const [isValidEmail, setIsValidEmail] = useState<boolean | null>(null);
  const [isValidPassWord, setIsValidPassword] = useState<boolean | null>(null);
  const [isValidNickname, setIsValidNickname] = useState<boolean | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [isPasswordsMatch, setIsPasswordsMatch] = useState<boolean | null>(null);
  //회원가입 필수 입력
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  //회원가입 추가 입력
  //개인-기업 공통 추가 입력
  const [location, setLocation] = useState<string>("서울");
  const [bio, setBio] = useState<string>("");
  //개인 추가 입력
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  //기업 추가 입력
  const [sport, setSport] = useState<string>("");
  const [priceInfo, setPriceInfo] = useState<string>("");

  const handleMembershipChange = (type: "개인회원" | "기업회원") => {
    setSelectedType(type);
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  };
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      // isNaN 체크는 변환된 값이 유효한 숫자인지 확인합니다.
      setHeight(inputValue);
    } else {
      setHeight(null);
    }
  };
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      setWeight(inputValue);
    } else {
      setWeight(null);
    }
  };
  const handlePriceInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInfo(e.target.value);
  };
  const handleSportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSport(e.target.value);
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

  //비밀번호 재확인 검사
  const checkPasswordsMatch = () => {
    setIsPasswordsMatch(password === passwordConfirm);
  };
  const clearPasswordsMatchValidation = () => {
    setIsPasswordsMatch(null);
  };
  //닉네임 유효성 검사
  const nicknameRegEx = /^[A-Za-z0-9]{6,20}$/;

  const validateNicknameHandler = () => {
    if (nicknameRegEx.test(nickname)) {
      setIsValidNickname(true);
    } else {
      setIsValidNickname(false);
    }
  };

  const clearNicknameValidation = () => {
    setIsValidNickname(null);
  };

  const onSubmitHandler = async () => {
    //개인회원
    if (selectedType === "개인회원") {
      if (isValidEmail && isValidPassWord && isValidNickname && isPasswordsMatch) {
        try {
          const formData = new FormData();

          // requestBody 부분 추가
          const requestBodyData = {
            email,
            password,
            nickname,
          };

          const blob = new Blob([JSON.stringify(requestBodyData)], {
            type: "application/json",
          });
          formData.append("requestBody", blob);

          const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/join/user`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("response:", response);
          alert("회원가입 완료");
          setIsSubmitted(true);
        } catch (error: any) {
          //에러 처리 로직..
          if (error.response.data.message === "회원이 존재합니다") {
            alert("중복된 이메일입니다");
          } else if (error.response.data.message === "닉네임이 존재합니다") {
            alert("중복된 닉네임입니다");
          }
          console.error("Error:", error);
        }
      } else {
        if (!isValidEmail) {
          alert("올바른 이메일을 입력해주세요.");
        } else if (!isValidPassWord) {
          alert("올바른 비밀번호를 입력해주세요.");
        } else if (!isPasswordsMatch) {
          alert("비밀번호가 일치하지 않습니다.");
        } else if (!isValidNickname) {
          alert("올바른 닉네임을 입력해주세요.");
        }
      }
    }
    //기업회원
    else {
      if (isValidEmail && isValidPassWord && isValidNickname && isPasswordsMatch) {
        setIsSubmitted(true);
      } else {
        if (!isValidEmail) {
          alert("올바른 이메일을 입력해주세요.");
        } else if (!isValidPassWord) {
          alert("올바른 비밀번호를 입력해주세요.");
        } else if (!isPasswordsMatch) {
          alert("비밀번호가 일치하지 않습니다.");
        } else if (!isValidNickname) {
          alert("올바른 닉네임을 입력해주세요.");
        }
      }
    }
  };

  //imgProps
  const [previewImg, setPreviewImg] = useState<ImageData | null>(null);
  useEffect(() => console.log(previewImg), [previewImg]);

  const onAdditionSubmitHandler = async () => {
    if (selectedType === "개인회원") {
      try {
        const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/mypage/update`, {
          location,
          bio,
          height,
          weight,
        });
        console.log("response:", response);
        navigate("/");
      } catch (error) {
        //에러 처리 로직..
        console.error("Error:", error);
      }
    }
    //기업회원
    else {
      if (
        location.trim() !== "" &&
        sport.trim() !== "" &&
        bio.trim() !== "" &&
        priceInfo.trim() !== "" &&
        previewImg !== null
      ) {
        try {
          const formData = new FormData();

          // requestBody 부분 추가
          const requestBodyData = {
            email,
            password,
            nickname,
            sport,
            location,
            bio,
            price: priceInfo,
          };

          const blob = new Blob([JSON.stringify(requestBodyData)], {
            type: "application/json",
          });
          formData.append("requestBody", blob);

          if (previewImg && previewImg.file) {
            formData.append("imageUrl", previewImg.file);
          }
          const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/join/store`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("response:", response);
          alert("회원가입 완료");
          navigate("/login");
        } catch (error: any) {
          //에러 처리 로직..
          if (error.response.data.message === "회원이 존재합니다") {
            alert("중복된 이메일입니다");
          } else if (error.response.data.message === "닉네임이 존재합니다") {
            alert("중복된 닉네임입니다");
          }
          console.error("Error:", error);
        }
      } else {
        if (location.trim() === "") {
          alert("지역을 선택해주세요.");
        } else if (sport.trim() === "") {
          alert("스포츠 종목을 입력해주세요.");
        } else if (bio.trim() === "") {
          alert("기업소개를 작성해주세요.");
        } else if (priceInfo.trim() === "") {
          alert("가격 정보를 입력해주세요.");
        } else if (previewImg === null) {
          alert("사진을 등록해주세요.");
        }
      }
    }
  };

  if (isSubmitted) {
    return (
      <SignupAddition
        selectedType={selectedType}
        onSubmit={onAdditionSubmitHandler}
        handleLocationChange={handleLocationChange}
        handleBioChange={handleBioChange}
        handleHeightChange={handleHeightChange}
        handleWeightChange={handleWeightChange}
        handlePriceInfoChange={handlePriceInfoChange}
        handleSportChange={handleSportChange}
        previewImg={previewImg}
        setPreviewImg={setPreviewImg}
      />
    );
  }
  return (
    <div className=" flex justify-center pt-[20px] mt-[20px] mb-[40px]  h-4/6 items-center ">
      <div className="w-[300px]">
        <MembershipButtonGroup selectedType={selectedType} onChange={handleMembershipChange} />

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
        />
        {isPasswordsMatch === false && (
          <p className="text-[12px] text-isValid-text-red">비밀번호가 일치하지 않습니다.</p>
        )}
        <CommonInput
          placeholder="닉네임을 입력해주세요."
          label="닉네임"
          type="text"
          onChange={handleNicknameChange}
          onBlur={validateNicknameHandler}
          onFocus={clearNicknameValidation}
        />
        <p className="text-[12px]">영문자, 숫자를 혼합하여 6~20자로 입력해주세요. </p>
        {isValidNickname === false && (
          <p className="text-[12px] text-isValid-text-red">유효하지 않은 닉네임 형식입니다.</p>
        )}

        <button
          type="submit"
          onClick={onSubmitHandler}
          className="w-[300px] py-2 rounded-[4px] text-[14px] mt-[25px] font-medium transition bg-sbc hover:bg-sbc-hover text-white"
        >
          {selectedType === "개인회원" ? "회원가입" : "다음"}
        </button>
      </div>
    </div>
  );
}

export default SignupPage;
