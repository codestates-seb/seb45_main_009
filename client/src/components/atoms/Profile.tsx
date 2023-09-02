import React, { InputHTMLAttributes } from 'react';

interface ProfileProps extends InputHTMLAttributes<HTMLInputElement> {
  photourl?: string,
  userid?:string,
  userheight?:number,
  userweight?:number,
  usercontent?:string,
}


const Profile :React.FC<ProfileProps> = ({photourl, userid,userheight,userweight,usercontent}) => {
    return (
        <div>
            <img src={photourl} className='w-20 h-20 rounded-full float-left mr-4' />
            <div className='font-bold text-2xl'>{userid}</div>
            <div className='flex  space-x-4'>
                <div className='text-gray-400 text-sm'>{userheight}</div>
                <div className='text-gray-400 text-sm'>{userweight}</div>
            </div>
            <div className='text-sm  mt-[4px]'>{usercontent}</div>
        </div>

    );
  };
  

export default Profile;
