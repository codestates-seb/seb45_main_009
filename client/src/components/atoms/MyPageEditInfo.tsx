import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import globalAxios from "../../data/data";
import { MdDelete } from "react-icons/md";
import { regionCategory } from "../../data/category";
import upload from "../../assets/images/upload.jpeg";
import CommonInput from "./CommonInput";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo, RootState } from "../../types/types";
import profileDefault from "../../assets/images/profileDefault.png";
import styled from "styled-components";
import ConfirmButton from "./ConfirmButton";
interface userData {
  nickname: string;
  bio: string;
  profileimg: string;
  price: string;
  height: number;
  weight: number;
  location: string;
  sport: string;
}
interface FormData {
  introduction: string;
  nickname: string;
  height: string;
  weight: string;
  primarySport: string;
}

interface ImageData {
  file: File | null;
  src: string;
}
function MyPageEditInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.login.userInfo);

  const [previewImg, setPreviewImg] = useState<ImageData | null>(null);
  //개인-기업 공통 추가 입력
  const [nickname, setNickname] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [sport, setSport] = useState<string>("");
  //개인 추가 입력
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  //기업 추가 입력
  const [priceInfo, setPriceInfo] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [isValidNickname, setIsValidNickname] = useState<boolean | null>(true);

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };
  const handlePriceInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInfo(e.target.value);
  };
  const handleSportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSport(e.target.value);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
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

  const insertImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // 5MB
      const maxFileSize = 5 * 1024 * 1024;

      // 파일 크기 검사
      if (file.size > maxFileSize) {
        alert("파일 크기가 너무 큽니다! 5MB 이하의 사진만 업로드해주세요.");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        const previewImgUrl = reader.result;
        if (typeof previewImgUrl === "string") {
          const newImgData: ImageData = {
            file: file,
            src: previewImgUrl,
          };
          setPreviewImg(newImgData);
        }
      };

      reader.onerror = () => {
        alert("사진 업로드 실패, 잠시 후 다시 시도해 주세요");
        console.error("An error occurred while reading the file.");
      };
    }
  };

  const deleteImg = () => {
    setPreviewImg(null);
  };
  //기존 정보 불러오기
  const getData = async () => {
    try {
      const response = await globalAxios.get("/mypage");
      const data: userData = response.data.data;
      console.log("불러오기 성공, data:", data);
      const preProfileImg = { file: null, src: data.profileimg };
      if ((preProfileImg.src = "https://fitfolio-photo.s3.ap-northeast-2.amazonaws.com/default+image/default.png")) {
      } else {
        setPreviewImg(preProfileImg);
      }
      setNickname(data.nickname);
      setLocation(data.location);
      setSport(data.sport);
      setBio(data.bio);
      setPriceInfo(data.price);
      setWeight(data.weight.toString());
      setHeight(data.height.toString());
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const onSubmit = async () => {
    if (!isValidNickname) {
      alert("올바른 닉네임을 입력해주세요.");
      return;
    }
    const formData = new FormData();
    const requestBody = {
      nickname: nickname,
      weight: parseInt(weight, 10),
      height: parseInt(height, 10),
      sport: sport,
      bio: bio,
      location: location,
      price: priceInfo,
    };
    console.log(requestBody);
    const blob = new Blob([JSON.stringify(requestBody)], {
      type: "application/json",
    });
    formData.append("requestBody", blob);
    if (previewImg && previewImg.file) {
      formData.append("imageUrl", previewImg.file);
    }
    try {
      const response = await globalAxios.patch("/mypage/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("개인정보 수정 성공");
      console.log("patch성공", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => console.log(nickname), [nickname]);
  useEffect(() => console.log(weight), [weight]);
  useEffect(() => console.log(height), [height]);
  useEffect(() => console.log(bio), [bio]);
  useEffect(() => console.log(sport), [sport]);
  return (
    <div className="flex flex-row justify-center items-center w-full mt-20 max-tablet:flex-col max-tablet:mt-10 ">
      <div className="w-[300px] mt-4 flex flex-col items-center mr-20 pb-[100px] max-tablet:mr-0 max-tablet mb-0">
        <span className="font-bold">프로필 사진</span>
        <div className="flex justify-center">
          <form encType="multipart/form-data">
            <div className="relative">
              <img
                src={previewImg ? previewImg.src : profileDefault}
                alt="previewImg"
                className="mt-4 rounded-full w-[200px] h-[200px] border object-cover"
              />
              <label
                htmlFor="file"
                className="absolute top-0 left-0 w-[200px] h-[200px] bg-transparent cursor-pointer border-0 rounded-full"
              ></label>
              {previewImg && (
                <button onClick={deleteImg} className="absolute right-[-30] flex flex-row items-center">
                  <MdDelete className="text-[#adaaaa] text-[20px] hover:text-[#595656] transition" />
                </button>
              )}
            </div>
            <input
              type="file"
              id="file"
              accept="image/*"
              className="absolute inset-0 overflow-hidden h-0 w-0"
              onChange={insertImg}
            />
          </form>
        </div>
      </div>
      <div className="w-[300px]  max-tablet:mt-4">
        {userInfo.userType === "USER" ? (
          <div className="flex flex-col">
            <CommonInput
              value={nickname}
              label="닉네임"
              onChange={handleNicknameChange}
              onBlur={validateNicknameHandler}
              onFocus={clearNicknameValidation}
            />
            <p className="text-[12px]">영문자, 숫자를 혼합하여 6~20자로 입력해주세요. </p>
            {isValidNickname === false && (
              <p className="text-[12px] text-isValid-text-red">유효하지 않은 닉네임 형식입니다.</p>
            )}
            <div className="flex flex-row">
              <CommonInput value={height} type="number" label="키(cm)" onChange={handleHeightChange} className="mr-2" />
              <CommonInput value={weight} type="number" label="몸무게(kg)" onChange={handleWeightChange} />
            </div>
            <CommonInput value={sport} label="주 운동 종목" onChange={handleSportChange} />
            <CommonInput value={bio} label="자기 소개" onChange={handleBioChange} />
          </div>
        ) : (
          <div className="flex flex-col">
            <CommonInput value={nickname} label="닉네임" onChange={handleNicknameChange} />
            <CommonInput value={location} label="주소" onChange={handleLocationChange} />
            <CommonInput value={sport} label="주 운동 종목" onChange={handleSportChange} />
            <CommonInput value={bio} label="기업 소개" onChange={handleBioChange} />
            <CommonInput value={priceInfo} label="가격 정보" onChange={handlePriceInfoChange} />
          </div>
        )}

        <div className="flex flex-row items-center justify-center mt-[16px]">
          <ConfirmButton label="수정하기" onClick={onSubmit} className="mr-2"></ConfirmButton>
          <ConfirmButton label="되돌리기" onClick={getData} />
        </div>
        <Link to={"/mypage/changepassword"}>
          <div className="my-10">
            <span className="font-bold text-[14px]">{`비밀번호 변경 >`}</span>
          </div>
        </Link>
        <Link to={"/mypage/withdraw"}>
          <div className="flex justify-end my-4">
            <span className="text-red-400 text-[12px]">회원 탈퇴하기</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MyPageEditInfo;
