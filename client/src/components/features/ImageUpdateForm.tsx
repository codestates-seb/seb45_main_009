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
        <span className="text-[12px] text-red">기존에 등록된 이미지는 삭제만 가능합니다</span>
        <div className="flex flex-row">
          {updatePreviewImg.length > 0
            ? updatePreviewImg.map((imgData, index) => (
                <div
                  className={`${index === updatePreviewImg.length - 1 ? "mr-0" : "mr-2"} relative group`}
                  key={index}
                >
                  <img
                    src={imgData.src}
                    alt={`uploadedimg-${index}`}
                    className="w-[100px] h-[120px] border border-bd object-cover bg-bdc"
                  />
                  <MdDelete
                    className="absolute bottom-1 right-1 cursor-pointer w-5 h-5 text-white opacity-0 transition group-hover:opacity-75"
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
