import React, { InputHTMLAttributes } from 'react';

interface CommonInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
  }

const CommonInput: React.FC<CommonInputProps> = ({ label, ...props }) => {
  return (
    <div className='text-[14px] mt-[20px] '>
      {label && <label className='font-bold'>{label}</label>}
      <input className="border w-full h-[40px] rounded-[4px] pl-[8px] text-[14px] mt-[8px]"  {...props} />
    </div>
  );
};


export default CommonInput;