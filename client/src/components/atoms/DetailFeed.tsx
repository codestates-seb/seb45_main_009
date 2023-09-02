import React, { InputHTMLAttributes } from 'react';

interface DeailFeedProps extends InputHTMLAttributes<HTMLInputElement> {
  photourl?:string,
  date?:string,
  content?:string,
  icon?:string,
}


const DeailFeed :React.FC<DeailFeedProps> = ({photourl,date,content, icon}) => {

    return (
      <div>
        <div className='w-[600px]'>
          <img src={photourl} className='mb-[10px]' />
        </div>
        <div className="font-bold text-gray-400 text-sm">{date}</div>
        <div className="mt-[20px]">{content}</div>
      </div>
    );
  };
  

export default DeailFeed;
