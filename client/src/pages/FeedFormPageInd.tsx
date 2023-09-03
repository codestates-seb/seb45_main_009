import React, { useState } from "react";

import { TiDelete } from "react-icons/ti";
import ImageForm from "../components/features/ImageForm";

interface ImageData {
  src: string;
  width: number;
  height: number;
  tags: TagData[];
}

interface TagData {
  x: number;
  y: number;
  data?: { name: string; price: string; info: string };
}

function FeedFormPageInd() {
  const [bodyValue, setBodyValue] = useState<string>("");

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
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

  const initialTag = ["#오운완"];
  const [addedTags, setAddedTags] = useState<string[]>(initialTag);
  const [inputTag, setInputTag] = useState<string>("");

  const removeTags = (indexToRemove: number): void => {
    setAddedTags(addedTags.filter((_, index) => index !== indexToRemove));
  };

  const inputTagHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputTag(event.target.value);
  };

  const addTags = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (inputTag !== "" && inputTag.length <= 18 && !addedTags.includes(inputTag) && addedTags.length < 5) {
      setAddedTags([...addedTags, `#${inputTag}`]);
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

  return (
    <div className="flex items-center flex-col my-20 h-screen">
      <div className="flex flex-row">
        <div className="flex flex-col w-[420px] mr-10 ">
          <ImageForm previewImg={previewImg} setPreviewImg={setPreviewImg}></ImageForm>
        </div>
        <div className="flex flex-col w-[420px]">
          <textarea
            className="h-[200px] border border-bdc rounded-md mb-5 p-2.5 resize-none  focus:outline-[#abb4af]"
            placeholder="글을 입력해 주세요"
            onChange={handleBodyChange}
          ></textarea>
          <div className=" mb-5">
            <div className="text-btc py-2 rounded mb-2 font-medium"># 연관 태그 필수 선택</div>
            <ul>
              {healthCategory.map((category, index) => (
                <li
                  key={index}
                  className={`text-btc inline-block px-2 py-1 border border-bdc rounded mr-2.5 mb-2.5 transition ${
                    selectedTags.includes(category) ? "bg-bts text-white" : "text-btc hover:bg-bts hover:text-white"
                  }`}
                  onClick={() => handleTagSelect(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-bdc rounded px-3 pt-2 mh-[50px] mb-8 text-btc ">
            <ul>
              {addedTags.map((tag, index) => (
                <li
                  key={index}
                  className="relative text-btc inline-block pl-2 pr-4 py-1 border border-bdc rounded mr-2.5 mb-2.5 bg-bts text-white group"
                >
                  <span className=" mr-2 inline-block">{tag}</span>
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
      </div>

      <div className="flex w-[880px] justify-end mb-2">
        <button className="text-btc px-6 py-2 border border-bdc rounded text-white transition bg-[#7DD9C4] hover:bg-[#4dab95]">
          등록하기
        </button>
      </div>
    </div>
  );
}

export default FeedFormPageInd;
