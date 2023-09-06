import { useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

function BackButton() {

  // 뒤로가기 버튼 
  const navigate = useNavigate();
  const handleClick =() =>{ navigate(-1);}

  return(
      <button
            className="w-10 h-10 rounded-full" 
            onClick={handleClick}>
              <BiArrowBack />
      </button>
  ) 
}

export default BackButton;