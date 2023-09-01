import React, { useState, useEffect } from "react";

import { TiDelete } from "react-icons/ti";

type Category = string;

function FeedFormPageInd() {
  //본문
  const [bodyValue, setBodyValue] = useState<string>("");

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setBodyValue(e.target.value);
  };

  //필수 선택 태그
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelect = (category: Category): void => {
    if (selectedTags.includes(category)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== category));
    } else {
      setSelectedTags([...selectedTags, category]);
    }
  };

  //입력 태그
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

  useEffect(() => console.log("bodyValue:", bodyValue), [bodyValue]);
  useEffect(() => console.log("selectedTags:", selectedTags), [selectedTags]);
  const healthCategory: Category[] = [
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

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col mr-10 h-[600px]">
          <div className="bg-[#D9D9D9] w-[360px] h-[400px]"></div>
          <div className="flex mt-5">
            <div className="bg-[#D9D9D9] w-[100px] h-[120px] mr-5"></div>
          </div>
        </div>
        <div className="flex flex-col h-[600px]">
          <textarea
            className="w-[360px] h-[200px] border border-bdc rounded-md mb-5 p-2.5 resize-none  focus:outline-[#abb4af]"
            placeholder="글을 입력해 주세요"
            onChange={handleBodyChange}
          ></textarea>
          <div className="w-[360px] mb-5">
            <div className="text-btc py-2 rounded mb-2"># 연관 태그 필수 선택</div>
            {healthCategory.map((category, index) => (
              <div
                key={index}
                className={`text-btc inline-block px-2 py-1 border border-bdc rounded mr-2.5 mb-2.5 ${
                  selectedTags.includes(category) ? "bg-bts text-white" : "text-btc"
                }`}
                onClick={() => handleTagSelect(category)}
              >
                {category}
              </div>
            ))}
          </div>
          <div className="border border-bdc rounded px-3 pt-2 w-[360px] mh-[50px] mb-5 text-btc ">
            <ul>
              {addedTags.map((tag, index) => (
                <li
                  key={index}
                  className="text-btc inline-block px-2 py-1 border border-bdc rounded mr-2.5 mb-2.5 bg-bts text-white "
                >
                  <span className="mr-2 inline-block">{tag}</span>
                  <TiDelete className="inline-block" onClick={() => removeTags(index)} />
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
          <button className="text-btc px-6 py-2 border border-bdc rounded">등록하기</button>
        </div>
      </div>
    </>
  );
}

export default FeedFormPageInd;
