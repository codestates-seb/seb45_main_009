import React, { useState } from 'react';

type MembershipType = '개인회원' | '기업회원';

interface MembershipButtonGroupProps {
  onChange: (type: MembershipType) => void;
}

const MembershipButtonGroup: React.FC<MembershipButtonGroupProps> = ({ onChange }) => {
  const [selectedType, setSelectedType] = useState<MembershipType | null>(null);

  const handleButtonClick = (type: MembershipType) => {
    setSelectedType(type);
    onChange(type);
  };

  return (
    <div>
      <button
        className={`w-[140px] h-[30px] rounded-[4px] text-[14px] font-medium ${selectedType === '개인회원' ? 'bg-btn-color text-white' : 'border'}`}
        onClick={() => handleButtonClick('개인회원')}
      >
        개인회원
      </button>
      <button
        className={`w-[140px] h-[30px] rounded-[4px] text-[14px] font-medium float-right ${selectedType === '기업회원' ? 'bg-btn-color text-white' : 'border'}`}
        onClick={() => handleButtonClick('기업회원')}
      >
        기업회원
      </button>
    </div>
  );
};

export default MembershipButtonGroup;