import React, { useState, useEffect } from "react";

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
  const initialTag = ["오운완"];
  const [addedTags, setAddedTags] = useState<string[]>(initialTag);
  const [inputTag, setInputTag] = useState<string>("");

  // const removeTags = (indexToRemove) => {
  //   setTags(tags.filter((el, index) => index !== indexToRemove));
  // };

  // const inputTagHandler = (event) => {
  //   setInputTag(event.target.value);
  // };

  // const addTags = (event) => {
  //   if (inputTag !== "" && !tags.includes(inputTag)) {
  //     setTags([...tags, inputTag]);
  //     setInputTag("");
  //   }
  // };

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
            className="w-[360px] h-[200px] border border-bdc rounded-md mb-5 p-2.5 resize-none  focus:outline-[#bdc]"
            placeholder="글을 입력해 주세요"
            onChange={handleBodyChange}
          ></textarea>
          <div className="w-[360px] mb-5">
            <div className="text-btc py-2 rounded mb-4"># 연관 태그 필수 선택</div>
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
          <div className="border border-bdc rounded px-8 py-2 w-[360px] mb-5 text-btc"># 연관 태그 추가</div>
          <button className="text-btc px-6 py-2 border border-bdc rounded">등록하기</button>
        </div>
      </div>
    </>
  );
}

export default FeedFormPageInd;
