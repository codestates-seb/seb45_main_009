import React from 'react';
import CommonInput from './CommonInput';

interface Props {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
  // handleRegister: () => void;
}

const UserCorForm: React.FC<Props> = ({ handleInputChange }) => {
  return (
    <>
      <div className='flex'>
          <div className='mr-[80px]'>
              <CommonInput placeholder="지역" type="text" onChange={(e) => handleInputChange(e, 'location')} />
          </div>
          <CommonInput placeholder="운동 종목" type="text" onChange={(e) => handleInputChange(e, 'exercise')} />
      </div>
      <CommonInput placeholder="기업소개" type="text" onChange={(e) => handleInputChange(e, 'selfintroduction')} />
      <CommonInput placeholder="기업 전화 번호" type="text" onChange={(e) => handleInputChange(e, 'phonenumber')} />
      <CommonInput placeholder="가격" type="text" onChange={(e) => handleInputChange(e, 'price')} />
    </>
  );
}

export default UserCorForm;