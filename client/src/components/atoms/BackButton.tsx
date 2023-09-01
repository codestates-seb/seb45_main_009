import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

function BackButton() {

  // 뒤로가기 버튼 
  const navigate = useNavigate();
  const handleClick =() =>{ navigate(-1);}

  return(
      <button
            className="w-10 h-10 rounded-full" 
            onClick={handleClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
      </button>

  ) 
}

export default BackButton;