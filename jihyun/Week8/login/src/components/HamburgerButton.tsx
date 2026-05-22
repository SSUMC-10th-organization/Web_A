interface HamburgerButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const HamburgerButton = ({ onClick, isOpen }: HamburgerButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <span
          className={`block h-0.5 w-full bg-gray-800 rounded transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-[9px]' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-gray-800 rounded transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-full bg-gray-800 rounded transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-[9px]' : ''
          }`}
        />
      </div>
    </button>
  );
};