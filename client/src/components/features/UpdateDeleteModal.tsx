import { Link } from "react-router-dom";

const Modal = ({ onDelete, onEdit, feedId, className }: any) => {
  return (
    <div className={`flex flex-col bg:white border rounded-[4px] w-[100px] z-40 ${className} `}>
      <button onClick={() => onDelete(feedId)} className="border-b">
        삭제
      </button>
      <Link to={`/feedupdateind/${feedId}`}>
        <button onClick={onEdit}>수정</button>
      </Link>
    </div>
  );
};

export default Modal;
