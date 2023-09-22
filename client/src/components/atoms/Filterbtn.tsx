interface FilterbtnProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

const Filterbtn = ({ name, isSelected, onClick }: FilterbtnProps) => {
  return (
    <button
      className={`text-[14px] inline-block px-2 py-1 rounded mr-2.5 mb-2.5 transition  ${
        isSelected
          ? "border font-medium border-[#edf7ff] bg-[#edf7ff] text-[#22a1ff] "
          : "border border-bdc text-[#999999] hover:bg-[#edf7ff] hover:text-[#22a1ff] hover:border-[#edf7ff] hover:cursor-pointer "
      }`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Filterbtn;
