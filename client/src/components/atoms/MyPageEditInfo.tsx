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
  const [userType, setUserType] = useState(userInfo.userType);
  useEffect(() => {
    setUserType((prevType) => userInfo.userType);
  }, [userInfo]);
  // const getData = async () => {
  //   try {
  //     const response = await globalAxios.get("/mypage");
  //     console.log(response.data);
  //   } catch (error: any) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getData();
  // }, []);
  const [previewImg, setPreviewImg] = useState<ImageData | null>(null);
  //개인-기업 공통 추가 입력
  const [bio, setBio] = useState<string>("");
  //개인 추가 입력
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  //기업 추가 입력
  const [sport, setSport] = useState<string>("");
  const [priceInfo, setPriceInfo] = useState<string>("");

  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
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

  return (
    <div className="flex justify-center items-center h-4/5">
      <div className="w-[300px]">
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
        {userType === "USER" ? (
          <>
            <div className="flex flex-col">
              <div className="w-1/2">
                <CommonInput type="text" label="닉네임" />
              </div>
              <div className="w-1/2">
                <CommonInput type="number" onChange={handleHeightChange} label="키" />
              </div>
              <div className="w-1/2">
                <CommonInput type="number" onChange={handleWeightChange} label="몸무게" />
              </div>
              <CommonInput type="text" onChange={handleBioChange} label="자기소개" />
              <div></div>
            </div>
          </>
        ) : (
          <>
            <CommonInput type="text" onChange={handleSportChange} label="주 운동 종목" />
            <CommonInput type="text" onChange={handleBioChange} label="기업소개" />
            <CommonInput type="text" onChange={handlePriceInfoChange} label="가격정보" />
          </>
        )}

        <div className="flex flex-col items-center justify-center mt-[30px]">
          <button></button>
        </div>
      </div>
    </div>
  );
}

export default MyPageEditInfo;
