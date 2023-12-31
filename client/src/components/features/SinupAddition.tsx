import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CommonInput from "../atoms/CommonInput";
import upload from "../../assets/images/upload.jpeg";
import { MdDelete } from "react-icons/md";

interface SignupAdditionProps {
  selectedType: "개인회원" | "기업회원";
  onSubmit: () => void;
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSportChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImg: ImageData | null;
  setPreviewImg: React.Dispatch<React.SetStateAction<ImageData | null>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ImageData {
  file: File | null;
  src: string;
}

function SignupAddition({
  selectedType,
  onSubmit,
  handleLocationChange,
  handleBioChange,
  handlePriceInfoChange,
  handleSportChange,
  previewImg,
  setPreviewImg,
  setIsSubmitted,
}: SignupAdditionProps) {
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
      };
    }
  };

  const deleteImg = () => {
    setPreviewImg(null);
  };
  const handleLastInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };
  return (
    <div className="flex justify-center items-center h-4/5">
      <div className="w-[300px] mt-4">
        <div className="flex justify-center">
          <form encType="multipart/form-data">
            <div className="relative">
              <img
                src={previewImg ? previewImg.src : upload}
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
        {selectedType === "개인회원" ? (
          <>
            {/* <div className="flex flex-col">
              <div className="w-1/2">
                <CommonInput placeholder="키" type="number" onChange={handleHeightChange} />
              </div>
              <div className="w-1/2">
                <CommonInput placeholder="몸무게" type="number" onChange={handleWeightChange} />
              </div>

              <CommonInput placeholder="자기소개" type="text" onChange={handleBioChange} />
            </div> */}
          </>
        ) : (
          <>
            <CommonInput label="주소" placeholder="주소를 입력해 주세요." onChange={handleLocationChange} />
            <CommonInput
              label="주 운동 종목"
              placeholder="운동 종목을 입력해 주세요."
              type="text"
              onChange={handleSportChange}
            />
            <CommonInput
              label="기업 소개"
              placeholder="기업 소개를 입력해 주세요"
              type="text"
              onChange={handleBioChange}
            />
            <CommonInput
              label="가격 정보"
              placeholder="가격 정보를 입력해 주세요."
              type="text"
              onChange={handlePriceInfoChange}
              onKeyUp={handleLastInputKeyUp}
            />
          </>
        )}

        <div className="flex flex-col items-center justify-center mt-[30px]">
          <button
            onClick={onSubmit}
            className="w-full py-2 rounded-[4px] text-[14px] mt-[20px] font-medium bg-sbc hover:bg-sbc-hover transition  text-white"
          >
            {selectedType === "개인회원" ? "등록" : "회원가입"}
          </button>
          {selectedType === "개인회원" ? (
            <Link
              to="/login"
              className="text-[12px] w-full mt-[20px] flex justify-center  font-medium text-gray-400 mb-[10px]"
            >
              건너뛰기
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SignupAddition;
