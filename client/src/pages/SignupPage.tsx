import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import globalAxios from "../data/data";
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
  const [isPasswordsMatch, setIsPasswordsMatch] = useState<boolean | null>(null);
  //회원가입 필수 입력
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  //회원가입 추가 입력
  //개인-기업 공통 추가 입력
  const [location, setLocation] = useState<string>("");
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
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
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
  const nicknameRegEx = /^[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3|a-zA-Z0-9]{2,12}$/;

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

          const response = await globalAxios.post("/join/user", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          alert("회원가입 완료");
          navigate("/login");
          // setIsSubmitted(true); 개인회원은 loginaddition 없앰
        } catch (error: any) {
          //에러 처리 로직..
          if (error.response.data.message === "회원이 존재합니다") {
            alert("중복된 이메일입니다");
          } else if (error.response.data.message === "닉네임이 존재합니다") {
            alert("중복된 닉네임입니다");
          }
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

  const onAdditionSubmitHandler = async () => {
    //기업회원
    if (location.trim() === "") {
      alert("주소를 입력해주세요.");
      return;
    }
    if (location.trim().length >= 35) {
      alert("주소는 34자까지 입력할 수 있습니다.");
      return;
    }
    if (sport.trim() === "") {
      alert("운동 종목을 입력해주세요.");
      return;
    }
    if (sport.trim().length >= 21) {
      alert("운동 종목은 20자까지 입력할 수 있습니다.");
      return;
    }
    if (bio.trim() === "") {
      alert("기업소개를 작성해주세요.");
      return;
    }
    if (bio.trim().length >= 31) {
      alert("기업 소개는 30자까지 입력할 수 있습니다.");
      return;
    }
    if (priceInfo.trim() === "") {
      alert("가격 정보를 입력해 주세요.");
      return;
    }
    if (priceInfo.trim().length >= 31) {
      alert("가격 정보는 30자까지 입력할 수 있습니다.");
      return;
    }
    if (previewImg === null) {
      alert("사진을 등록해주세요.");
      return;
    }
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
      const response = await globalAxios.post("/join/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("회원가입 완료");
      navigate("/login");
    } catch (error: any) {
      //에러 처리 로직..
      if (error.response.data.message === "회원이 존재합니다") {
        alert("중복된 이메일입니다");
        setIsSubmitted(false);
      } else if (error.response.data.message === "닉네임이 존재합니다") {
        alert("중복된 닉네임입니다");
        setIsSubmitted(false);
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
        handlePriceInfoChange={handlePriceInfoChange}
        handleSportChange={handleSportChange}
        previewImg={previewImg}
        setPreviewImg={setPreviewImg}
        setIsSubmitted={setIsSubmitted}
      />
    );
  }
  const handleLastInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    validateNicknameHandler();
    if (e.key === "Enter") {
      onSubmitHandler();
    }
  };
  return (
    <div className=" flex justify-center pt-[20px] mt-[20px] mb-[40px]  h-4/6 items-center ">
      <div className="w-[300px]">
        <MembershipButtonGroup selectedType={selectedType} onChange={handleMembershipChange} />
        <CommonInput
          placeholder="이메일을 입력해 주세요."
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
          placeholder="비밀번호를 입력해 주세요."
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
          placeholder="비밀번호를 다시 입력해 주세요."
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
          placeholder="닉네임을 입력해 주세요."
          label="닉네임"
          type="text"
          onChange={handleNicknameChange}
          onBlur={validateNicknameHandler}
          onFocus={clearNicknameValidation}
          onKeyUp={handleLastInputKeyUp}
        />
        <p className="text-[12px]">한글, 영문자, 숫자를 조합하여 2~12자로 입력해주세요.</p>
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
