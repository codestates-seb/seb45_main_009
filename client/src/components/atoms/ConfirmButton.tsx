interface ConfirmButtonProps {
  label?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
}
const ConfirmButton = ({ label, className, onClick, disabled }: ConfirmButtonProps) => {
  return (
    <button
      className={`w-[300px] py-2 rounded-[4px] text-[14px] mt-[25px] font-medium text-white transition bg-sbc hover:bg-sbc-hover ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ConfirmButton;
