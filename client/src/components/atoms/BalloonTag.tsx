import React, { useState } from "react";

interface BallonTagProps {
  onDelete: () => void;
  onSave: (data: { name: string; price: string; info: string }) => void;
  data?: {
    name: string;
    price: string;
    info: string;
  };
}

function BallonTag({ onDelete, onSave, data }: BallonTagProps) {
  const [name, setName] = useState(data?.name || "");
  const [price, setPrice] = useState(data?.price || "");
  const [info, setInfo] = useState(data?.info || "");

  const handleSave = () => {
    onSave({ name, price, info });
  };

  return (
    <div className="relative w-36 z-40">
      <div className="absolute w-3 h-3 bg-white left-1/2 transform -translate-x-1/2 mt-[-6px] rotate-45"></div>
      <div className="flex flex-col border border-bdc rounded-md px-2 pt-2 z-20 bg-white mt-3">
        <div className="flex flex-row mb-2">
          <input
            placeholder="상품 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mr-2"
          />
        </div>
        <div className="flex flex-row mb-2">
          <input placeholder="가격" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mr-2" />
        </div>
        <div className="flex flex-row mb-2">
          <input
            placeholder="추가 정보"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            className="w-full mr-2"
          />
        </div>
        <div className="flex mb-2 w-full ">
          <button
            onClick={handleSave}
            className="p-1 w-2/3 bg-[#8bb1c4] hover:bg-[#608a9e] transition mr-2 rounded text-white"
          >
            확인
          </button>
          <button
            className="p-1 w-1/3 bg-[#b8bcbf] hover:bg-[#8e9194] transition opacity-75 rounded text-white"
            onClick={onDelete}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default BallonTag;
