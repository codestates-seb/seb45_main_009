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
      className={`mr-1 mb-1 p-1 border rounded-lg sm:mr-3 sm:mb-2 sm:px-3 sm:py-1  ${
        isSelected ? "bg-btn-color text-white" : ""
      }`}
      onClick={handleClick}
    >
      {name}
    </button>
  );
};

export default Filterbtn;
