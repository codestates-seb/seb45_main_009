import React from "react";
import { useNavigate } from "react-router";

const Withdraw = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col">
        <p className="text-3xl font-bold mb-10">회원 탈퇴 신청</p>
        <p className="text-sm">
          회원탈퇴 후 FITFOLIO 서비스에 입력한 게시물 및 댓글은 삭제되지 않으며,
          <br />
          회원정보 삭제로 인해 작성자 본인을 확인할 수 없으므로 게시물 편집 및
          <br />
          삭제 처리가 원천적으로 불가능 합니다. 게시물 삭제를 원하시는 경우에는
          <br />
          먼저 해당 게시물을 삭제 하신 후, 탈퇴를 신청하시기 바랍니다.
        </p>

        <button className="border rounded-lg p-3 my-5 bg-modify-btn-color hover:text-white  min-w-[300px]">
          탈퇴하기
        </button>
        <div
          className="flex justify-end text-red-500 mt-10 hover:cursor-pointer"
          onClick={() => navigate(-1)}
        >
          취소
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
