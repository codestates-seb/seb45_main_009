// import CommonInput from '../components/atoms/CommonInput'
import BlueButton from '../components/atoms/BlueButton' 
import React, { useState } from 'react';
import UserInfoForm from  '../components/atoms/UserIndfrom';
import UserCorForm from  '../components/atoms/UserCorfrom';




function Loginaddition() {
    const [ind, setind] = useState<boolean>(false);

    // 미리보기 url 저장
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedImage = e.target.files[0];
            
            // 이미지 미리보기 설정
            const imageUrl = URL.createObjectURL(selectedImage);
            setPreviewImage(imageUrl);
            setUserInfo(prev => ({ ...prev, imageUrl: imageUrl }));
        }
    };

    const  [userInfo, setUserInfo] =  useState({
        imageUrl : '',
        height : 0,
        weight : 0,
        location : '',
        exercise  : '',
        selfintroduction : '',
        phonenumber : '',
        price : ''
    })

    const handleInputChange :any = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof userInfo) => {
        setUserInfo(prev => ({ ...prev, [key]: e.target.value }));
    };
    
    const handleRegister = () => {
        console.log(userInfo)
    };


  return (
    < div className="flex  justify-center">
        <div className="w-[400px]">
            <input type='file'  onChange={handleImageUpload} />
            <div className='flex justify-center'>
                {previewImage && <img src={previewImage} alt="Preview" className="mt-4 rounded-full w-[100px] h-[100px] border" />}
            </div>
            { ind === true ? 
                <UserInfoForm handleInputChange={handleInputChange}/> :
                <UserCorForm handleInputChange={handleInputChange}/>  }
            
            <div className='flex justify-center mt-[30px]'>
                <button className='w-full h-[30px] rounded-[4px] text-[14px] mt-[20px] font-medium bg-btn-color text-white' onClick={handleRegister}>등록</button>
            </div>
        </div>
    </ div>
  );
}

export default Loginaddition;