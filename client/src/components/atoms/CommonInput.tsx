import React, { InputHTMLAttributes } from "react";
import styled from "styled-components";

interface CommonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  className?: string;
}

const CommonInput: React.FC<CommonInputProps> = ({ label, className, ...props }) => {
  return (
    <StyledCommonInput className={`text-[14px] mt-[20px]  ${className}`}>
      {label && <label className="font-bold">{label}</label>}
      <input className={`border w-full h-[40px] rounded-[4px] pl-[8px] text-[14px] mt-[8px]`} {...props} />
    </StyledCommonInput>
  );
};

export default CommonInput;

const StyledCommonInput = styled.div`
  Chrome,
  Safari,
  Edge,
  Opera input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;
