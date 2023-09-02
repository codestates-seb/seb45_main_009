import React, { useState } from "react";
import axios from "axios";
import upload from "../../assets/images/upload.jpeg";
import BallonTag from "../atoms/BalloonTag";
function ImageForm() {
  const [selectedImg, setSeletedImg] = useState<string>("");
  const [previewImg, setPreviewImg] = useState<string[]>([]);

  const insertImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader();
    console.log(e.target.files);
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onloadend = () => {
      const previewImgUrl = reader.result;
      if (typeof previewImgUrl === "string") {
        setPreviewImg([...previewImg, previewImgUrl]);
        setSeletedImg(previewImgUrl);
      }
    };
    reader.onerror = () => {
      console.error("An error occurred while reading the file.");
    };
  };

  const deleteImg = (index: number) => {
    setPreviewImg(previewImg.filter((el, idx: number) => idx !== index));
  };

  return (
    <div>
      <div className="w-full h-[300px] bg-bdc mb-6">
        <img src={selectedImg} alt="selectedImg" className="w-full h-full object-contain " />
      </div>
      <form encType="multipart/form-data" className="">
        <label htmlFor="file" className=" text-[#fff] p-2.5 bg-[#438a90] cursor-pointer border border-bdc rounded">
          사진 올리기
        </label>
        <input
          type="file"
          id="file"
          accept="image/*"
          className="absolute inset-0 overflow-hidden h-0 w-0"
          onChange={(e) => insertImg(e)}
        />
      </form>
      <div className="flex flex-row w-full  mb-4">
        {previewImg.length > 0 ? (
          previewImg.reverse().map((imgSrc, index) => (
            <div className="mr-4 " key={index}>
              <img
                src={imgSrc}
                alt={`uploadedimg-${index}`}
                className="w-[100px] h-[120px] border border-bd object-cover bg-bdc"
              />
              <button onClick={() => deleteImg(index)}>Delete</button>
            </div>
          ))
        ) : (
          <img src={upload} alt="defaultimg" className="w-[100px] h-[120px] " />
        )}
      </div>
      <BallonTag></BallonTag>
    </div>
  );
}

export default ImageForm;
