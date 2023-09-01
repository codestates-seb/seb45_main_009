interface FilterbtnProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

const Filterbtn = ({ name, isSelected, onClick }: FilterbtnProps) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      className={`mr-5 mb-2 border rounded-lg px-3 py-1 ${
        isSelected ? "bg-btn-color" : ""
      }`}
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default Filterbtn;
