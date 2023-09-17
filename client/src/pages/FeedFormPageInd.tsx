import React, { useState, useEffect } from "react";

import { TiDelete } from "react-icons/ti";
import ImageForm from "../components/features/ImageForm";
import { useNavigate } from "react-router";
import globalAxios from "../data/data";
import { ImageData } from "../types/types";

function FeedFormPageInd() {
  const navigate = useNavigate();
  const [bodyValue, setBodyValue] = useState<string>("");

  const handleBodyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setBodyValue(e.target.value);
  };

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelect = (category: string): void => {
    if (selectedTags.includes(category)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== category));
    } else {
      setSelectedTags([...selectedTags, category]);
    }
  };

  const initialTag = ["오운완"];
  const [addedTags, setAddedTags] = useState<string[]>(initialTag);
  const [inputTag, setInputTag] = useState<string>("");

  const removeTags = (indexToRemove: number): void => {
    setAddedTags(addedTags.filter((_, index) => index !== indexToRemove));
  };

  const inputTagHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setInputTag(event.target.value);
  };

  const addTags = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (
      inputTag !== "" &&
      inputTag.length <= 18 &&
      !addedTags.includes(inputTag) &&
      addedTags.length < 5
    ) {
      setAddedTags([...addedTags, inputTag]);
      setInputTag("");
    }
  };
  const healthCategory: string[] = [
    "헬스",
    "필라테스",
    "크로스핏",
    "러닝",
    "수영",
    "요가",
    "홈트",
    "축구",
    "농구",
    "기타",
  ];

  //imageform props
  const [previewImg, setPreviewImg] = useState<ImageData[]>([]);
  const submitForm = async () => {
    if (bodyValue.trim().length === 0) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (selectedTags.length === 0) {
      alert("연관 태그를 하나 이상 선택해주세요.");
      return;
    }
    if (previewImg.length === 0) {
      alert("사진을 하나 이상 등록해주세요.");
      return;
    }

    const formData = new FormData();

    const feedPostDto = {
      content: bodyValue,
      relatedTags: [...addedTags, ...selectedTags],
    };

    const blob = new Blob([JSON.stringify(feedPostDto)], {
      type: "application/json",
    });
    formData.append("feedPostDto", blob);

    previewImg.forEach((img, index) => {
      if (img.file) {
        formData.append("imageUrl", img.file, `image_${index}.jpg`);
      }
    });

    try {
      const response = await globalAxios.post("/feed/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      //말풍선태그 추가api
      const imageIds = response.data.images.map(
        (imageData: any) => imageData.imageId
      );
      for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        const imgTagData = previewImg[i].tags;

        for (const tagData of imgTagData) {
          const tagPostData = {
            productName: tagData.data?.name,
            productPrice: tagData.data?.price,
            productInfo: tagData.data?.info,
            positionX: tagData.x,
            positionY: tagData.y,
          };
          console.log(tagPostData);
          const formData = new FormData();
          const blob = new Blob([JSON.stringify(tagPostData)], {
            type: "application/json",
          });
          formData.append("imageTag", blob);

          try {
            const response = await globalAxios.post(
              `/image/${imageId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log(response);
          } catch (error) {
            console.error("error", error);
          }
        }
      }
      alert("포스팅 성공");
      navigate("/");
    } catch (error: any) {
      console.error("erro:", error);
    }
  };
  useEffect(() => console.log(previewImg), [previewImg]);
  return (
    <div className="flex justify-center items-center flex-col my-20 ">
      <div className="flex flex-row relative max-mobile:flex-col max-mobile:mx-1 max-tablet:flex-col">
        <div className="flex flex-col  min-w-[300px] max-w-[420px] mr-10 max-mobile:mr-1 max-tablet:mr-1">
          <ImageForm
            previewImg={previewImg}
            setPreviewImg={setPreviewImg}
          ></ImageForm>
        </div>
        <div className="flex flex-col min-w-[300px] max-w-[420px]  max-mobile:mt-4 max-tablet:mt-4">
          <textarea
            className="h-[200px] border border-bdc rounded-md mb-5 p-2.5 resize-none  focus:outline-[#abb4af]
            "
            placeholder="글을 입력해 주세요"
            onChange={handleBodyChange}
          ></textarea>
          <div className=" mb-5">
            <div className="text-btc py-2 rounded mb-2 font-medium">
              # 연관 태그 필수 선택
            </div>
            <ul>
              {healthCategory.map((category, index) => (
                <li
                  key={index}
                  className={`text-btc inline-block px-2 py-1  rounded mr-2.5 mb-2.5 transition ${
                    selectedTags.includes(category)
                      ? "bg-bts text-white border border-bts"
                      : "text-btc hover:bg-bts border border-bdc hover:text-white"
                  }`}
                  onClick={() => handleTagSelect(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-bdc rounded px-3 pt-2 mh-[50px] mb-8 text-btc mb-20">
            <ul>
              {addedTags.map((tag, index) => (
                <li
                  key={index}
                  className="relative text-btc inline-block pl-2 pr-4 py-1 border border-bdc rounded mr-2.5 mb-2.5 bg-bts text-white group"
                >
                  <span className=" mr-2 inline-block">{`#${tag}`}</span>
                  <TiDelete
                    className="opacity-0 group-hover:opacity-100 transition absolute right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => removeTags(index)}
                  />
                </li>
              ))}
              {addedTags.length === 5 ? null : (
                <input
                  className="outline-none mb-2.5 "
                  type="text"
                  onKeyUp={(event) => {
                    if (event.key === "Enter") {
                      addTags(event);
                    }
                  }}
                  value={inputTag}
                  placeholder="연관 태그 추가"
                  onChange={inputTagHandler}
                />
              )}
            </ul>
          </div>
        </div>
        <button
          onClick={submitForm}
          className="absolute bottom-[-30px] max-tablet:bottom-[-10px] max-mobile:bottom-[0px]  right-0 text-btc px-6 py-2 border border-bdc rounded text-white transition bg-[#7DD9C4] hover:bg-[#4dab95] max-mobile:mx-1
          "
        >
          등록하기
        </button>
        <div className="max-tablet:h-[60px] max-mobile:h-[80px]"></div>
      </div>
    </div>
  );
}

export default FeedFormPageInd;
