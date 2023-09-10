import React, { useState } from "react";
import upload from "../../assets/images/upload.jpeg";
import BallonTag from "../atoms/BalloonTag";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

interface ImageFormProps {
  previewImg: ImageData[];
  setPreviewImg: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

interface TagData {
  x: number;
  y: number;
  data?: { name: string; price: string; info: string };
}

interface ImageData {
  file: File | null;
  src: string;
  tags: TagData[];
}

function ImageForm({ previewImg, setPreviewImg }: ImageFormProps) {
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null);
  const [isTaggingMode, setIsTaggingMode] = useState<boolean>(false);
  const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(null);

  const insertImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTaggingMode(false);
    if (e.target.files) {
      // 선택된 파일들을 배열로 가져옴
      const files = Array.from(e.target.files);

      //5MB
      const maxFileSize = 5 * 1024 * 1024;
      //파일 크기 검사
      const oversizedFiles = files.filter((file) => file.size > maxFileSize);
      if (oversizedFiles.length > 0) {
        alert("파일 크기가 너무 큽니다! 5MB 이하의 사진만 업로드해주세요.");
        return;
      }

      // 이미 추가된 이미지와 새로 선택된 이미지의 합계가 5를 초과하는 경우, 초과분 제거
      const availableSlots = 5 - previewImg.length;
      if (files.length > availableSlots) {
        files.splice(availableSlots, files.length - availableSlots);
      }

      files.forEach((file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
          const previewImgUrl = reader.result;
          if (typeof previewImgUrl === "string") {
            const newImgData: ImageData = {
              file: file,
              src: previewImgUrl,
              tags: [],
            };
            setPreviewImg((prev) => [...prev, newImgData]);
            setSelectedImgIndex(previewImg.length);
          }
        };

        reader.onerror = () => {
          alert("사진 업로드 실패, 잠시 후 다시 시도해 주세요");
          console.error("An error occurred while reading the file.");
        };
      });
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!isTaggingMode || selectedImgIndex === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    const yRatio = (e.clientY - rect.top) / rect.height;
    const x = parseFloat((xRatio * 100).toFixed(2));
    const y = parseFloat((yRatio * 100).toFixed(2));
    const updatedImg = { ...previewImg[selectedImgIndex] };
    updatedImg.tags.push({ x, y });
    const updatedPreview = [...previewImg];
    updatedPreview[selectedImgIndex] = updatedImg;

    setPreviewImg(updatedPreview);
    setSelectedTagIndex(updatedImg.tags.length - 1);
  };

  const deleteImg = (index: number) => {
    const updatedPreview = previewImg.filter((_, idx) => idx !== index);
    setPreviewImg(updatedPreview);

    // 삭제된 이미지가 현재 선택된 이미지인 경우
    if (selectedImgIndex === index) {
      // 첫 번째 이미지가 아니라면 이전 이미지 선택
      if (index > 0) {
        setSelectedImgIndex(index - 1);
      } else {
        // 첫 번째 이미지가 삭제되면 다음 이미지 (만약 있을 경우) 선택
        if (updatedPreview.length > 0) {
          setSelectedImgIndex(0);
        } else {
          setSelectedImgIndex(null);
        }
      }
    } else if ((selectedImgIndex as number) > index) {
      // 삭제된 이미지가 선택된 이미지 앞쪽에 있는 경우 (선택된 이미지의 인덱스 조절)
      setSelectedImgIndex((selectedImgIndex as number) - 1);
    }
  };

  const handleTaggingMode = () => {
    if (selectedImgIndex === null) return;
    setIsTaggingMode(!isTaggingMode);
  };

  const deleteTag = (tagIndex: number) => {
    const updatedImg = { ...previewImg[selectedImgIndex as number] };
    updatedImg.tags.splice(tagIndex, 1);
    const updatedPreview = [...previewImg];
    updatedPreview[selectedImgIndex as number] = updatedImg;
    setPreviewImg(updatedPreview);
  };

  const handleTagSave = (index: number, data: { name: string; price: string; info: string }) => {
    const updatedImg = { ...previewImg[selectedImgIndex as number] };
    updatedImg.tags[index] = { ...updatedImg.tags[index], data };
    const updatedPreview = [...previewImg];
    updatedPreview[selectedImgIndex as number] = updatedImg;
    setPreviewImg(updatedPreview);
    setSelectedTagIndex(null);
  };

  const handleTagSelect = (index: number) => {
    if (selectedTagIndex === index) {
      setSelectedTagIndex(null);
    } else {
      setSelectedTagIndex(index);
    }
  };

  const handleImageSelect = (index: number) => {
    setSelectedImgIndex(index);
    setIsTaggingMode(false);
  };

  const selectedImg = selectedImgIndex !== null ? previewImg[selectedImgIndex]?.src : "";

  return (
    <div>
      <div className="w-full  mb-2 relative">
        <img
          src={previewImg.length > 0 ? selectedImg : upload}
          alt="selectedImg"
          className="w-[420px] h-auto object-contain "
          onClick={handleImageClick}
        />
        {previewImg.length !== 0 ? (
          <button
            onClick={handleTaggingMode}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 py-2 px-3 bg-[#5ea1db] text-white rounded hover:bg-[#3688cf] transition"
          >
            {isTaggingMode ? "태그 추가 완료" : "상품 태그 추가"}
          </button>
        ) : null}

        {selectedImgIndex !== null &&
          previewImg[selectedImgIndex]?.tags.map((tag, index) => (
            <React.Fragment key={index}>
              <AiFillPlusCircle
                className="text-[#5ea1db] hover:text-[#3688cf] cursor-pointer w-5 h-5"
                style={{
                  position: "absolute",
                  top: `calc(${tag.y * 100}% - 12px)`,
                  left: `calc(${tag.x * 100}% - 12px)`,
                }}
                onClick={() => handleTagSelect(index)}
              />
              {selectedTagIndex === index && (
                <div
                  style={{
                    position: "absolute",
                    top: `calc(${tag.y * 100}% + 18px)`,
                    left: `calc(${tag.x * 100}% - 62px)`,
                  }}
                >
                  <BallonTag
                    data={tag.data}
                    onDelete={() => deleteTag(index)}
                    onSave={(data) => handleTagSave(index, data)}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
      </div>

      <div className="flex flex-row w-full mb-4">
        {previewImg.length > 0
          ? previewImg.map((imgData, index) => (
              <div className={`${index === previewImg.length - 1 ? "mr-0" : "mr-2"} relative group`} key={index}>
                <img
                  src={imgData.src}
                  alt={`uploadedimg-${index}`}
                  className="w-[100px] h-[120px] border border-bd object-cover bg-bdc"
                  onClick={() => handleImageSelect(index)}
                />
                <MdDelete
                  className="absolute bottom-1 right-1 cursor-pointer w-5 h-5 text-white opacity-0 transition group-hover:opacity-75"
                  onClick={() => deleteImg(index)}
                ></MdDelete>
              </div>
            ))
          : null}
      </div>
      <form encType="multipart/form-data">
        <label
          htmlFor="file"
          className="text-[#fff] p-2.5 bg-[#75babf] transition cursor-pointer border border-bdc rounded hover:bg-[#438a90]"
        >
          사진 올리기
        </label>
        <input
          type="file"
          id="file"
          accept="image/*"
          className="absolute inset-0 overflow-hidden h-0 w-0"
          onChange={insertImg}
          multiple
        />
      </form>
    </div>
  );
}

export default ImageForm;
