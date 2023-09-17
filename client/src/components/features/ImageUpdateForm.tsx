import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FetcedImageData } from "../../types/types";

interface ImageUpdateFormProps {
  updatePreviewImg: FetcedImageData[];
  setUpdatePreviewImg: React.Dispatch<React.SetStateAction<FetcedImageData[]>>;
  imageToDelete: number[];
  setImageToDelete: React.Dispatch<React.SetStateAction<number[]>>;
}

function ImageUpdateForm({
  updatePreviewImg,
  setUpdatePreviewImg,
  imageToDelete,
  setImageToDelete,
}: ImageUpdateFormProps) {
  const deleteImg = (index: number, imageId: number) => {
    console.log(imageToDelete);
    const updatedPreview = updatePreviewImg.filter((_, idx) => idx !== index);
    setUpdatePreviewImg(updatedPreview);
    setImageToDelete([...imageToDelete, imageId]);
    console.log(imageToDelete);
  };

  return (
    <div>
      {" "}
      <div className="flex flex-col w-full mb-2">
        <div className="flex flex-row">
          {updatePreviewImg.length > 0
            ? updatePreviewImg.map((imgData, index) => (
                <div
                  className={`${index === updatePreviewImg.length - 1 ? "mr-0" : "mr-2"} relative group`}
                  key={index}
                >
                  <div className="relative">
                    <img
                      src={imgData.src}
                      alt={`uploadedimg-${index}`}
                      className="w-[100px] h-[120px] border border-bd object-cover bg-bdc"
                    />
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12px] text-white w-3/4">
                    기존 이미지는 삭제만 가능
                  </div>
                  <MdDelete
                    className="absolute bottom-1 right-1 cursor-pointer w-5 h-5 text-white opacity-0 transition group-hover:opacity-100"
                    onClick={() => deleteImg(index, imgData.imageId)}
                  ></MdDelete>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default ImageUpdateForm;
