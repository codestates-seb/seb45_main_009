import React from "react";
function BallonTag() {
  return (
    <div className="absolute flex flex-col border border-bdc rounded-md px-2 pt-2 ">
      <div className="flex flex-row mb-2">
        <input placeholder="상품 이름" className="w-24 mr-2" />
        <button>등록</button>
      </div>
      <div className="flex flex-row mb-2">
        <input placeholder="가격" className="w-24 mr-2" />
        <button>등록</button>
      </div>
      <div className="flex flex-row mb-2">
        <input placeholder="사이즈" className="w-24 mr-2" />
        <button>등록</button>
      </div>
    </div>
  );
}

export default BallonTag;
