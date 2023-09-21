import React from "react";
import { useNavigate } from "react-router";
import ConfirmButton from "./ConfirmButton";
import globalAxios from "../../data/data";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/loginSlice";

const Withdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user_info");
    navigate("/");
  };
  const handleWithdraw = async () => {
    try {
      const response = await globalAxios.delete("/mypage/delete");
      alert("회원탈퇴 완료");
      logoutHandler();
    } catch (error) {}
  };
  return (
    <div className="flex flex-col justify-center items-center mt-20 max-mobile:mt-10 h-1/2">
      <p className="text-2xl font-bold mb-10">회원 탈퇴 안내</p>
      <div className="flex flex-col w-[300px]">
        <p className="text-sm">
          회원님이 탈퇴를 진행할 경우, 작성하신 게시물과 댓글 등 모든 활동 정보는 영구적으로 삭제되며 이후 복구가
          불가능합니다. 또한 탈퇴 이후에는 FitFolio의 모든 서비스 이용이 제한됩니다. 회원님의 소중한 정보를 안전하게
          관리하기 위해 항상 최선을 다하고 있습니다. 탈퇴를 원하시면 아래의 '탈퇴하기' 버튼을 클릭하여 진행해 주시기
          바랍니다.
        </p>
        <ConfirmButton label="탈퇴하기" onClick={handleWithdraw}></ConfirmButton>
        <div className="flex justify-end  mt-10 hover:cursor-pointer" onClick={() => navigate(-1)}>
          취소
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
