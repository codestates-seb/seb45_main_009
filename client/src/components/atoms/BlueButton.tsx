import React, { InputHTMLAttributes } from 'react';

interface BlueButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  }

const BlueButton :React.FC<BlueButtonProps> = ({label}) => {
  return (
    <button type='submit' className="w-[300px] h-[30px] rounded-[4px] text-[14px] mt-[20px] font-medium bg-btn-color text-white">{label}</button>
  );
};


export default BlueButton;