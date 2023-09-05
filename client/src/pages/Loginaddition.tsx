import CommonInput from '../components/atoms/CommonInput'
import BlueButton from '../components/atoms/BlueButton' 
import React, { useState } from 'react';


function Loginaddition() {
    // 미리보기 url 저장
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            
            // 이미지 미리보기 설정
            const imageUrl = URL.createObjectURL(selectedImage);
            setPreviewImage(imageUrl);
        }
    };

    const  [userInfo, setUserInfo] =  useState({
        height : 0,
        weight : 0,
        location : '',
        exercise  : '',
        selfintroduction : ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof userInfo) => {
        setUserInfo(prev => ({ ...prev, [key]: e.target.value }));
    };
    
    const handleRegister = () => {
        // console.log("저장한값"+userInfo); // 사용자 정보 객체를 로깅
        console.log('버튼 클릭')
        // 추가적인 처리
    };

  return (
    < div className="flex  justify-center">
        <div className="w-[400px]">
            <input type='file'  onChange={handleImageUpload} />
            <div className='flex justify-center'>
                {previewImage && <img src={previewImage} alt="Preview" className="mt-4 rounded-full w-[200px] h-[200px]" />}
            </div>

            <div className='flex'>
                <div className='mr-[80px]'>
                    <CommonInput placeholder="키" type="text" onChange={(e) => handleInputChange(e, 'height')} />
                </div>
                <CommonInput placeholder="몸무게" type="text" onChange={(e) => handleInputChange(e, 'weight')} />
            </div>
            <div className='flex'>
                <div className='mr-[80px]'>
                    <CommonInput placeholder="지역" type="text" onChange={(e) => handleInputChange(e, 'location')} />
                </div>
                <CommonInput placeholder="주 운동 종목" type="text" onChange={(e) => handleInputChange(e, 'exercise')} />
            </div>
            <CommonInput placeholder="자기소개" type="text" onChange={(e) => handleInputChange(e, 'selfintroduction')} />

            <div className='flex justify-center'>
                <BlueButton label='등록' className='w-full' onClick={handleRegister}/>
            </div>
            {/* <div>건너뛰기</div> */}
        </div>
    </ div>
  );
}

export default Loginaddition;