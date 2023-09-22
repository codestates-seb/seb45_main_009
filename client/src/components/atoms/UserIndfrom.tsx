import React from "react";
import CommonInput from "./CommonInput";
// import BlueButton from './BlueButton';

interface Props {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  // handleRegister: () => void;
}

const UserInfoForm: React.FC<Props> = ({ handleInputChange }) => {
  return (
    <>
      <div className="flex">
        <div className="mr-[80px]">
          <CommonInput placeholder="키" type="text" onChange={(e) => handleInputChange(e, "height")} />
        </div>
        <CommonInput placeholder="몸무게" type="text" onChange={(e) => handleInputChange(e, "weight")} />
      </div>
      <div className="flex">
        <div className="mr-[80px]">
          <CommonInput placeholder="지역" type="text" onChange={(e) => handleInputChange(e, "location")} />
        </div>
        <CommonInput placeholder="주 운동 종목" type="text" onChange={(e) => handleInputChange(e, "exercise")} />
      </div>
      <CommonInput placeholder="자기소개" type="text" onChange={(e) => handleInputChange(e, "selfintroduction")} />
    </>
  );
};

export default UserInfoForm;
