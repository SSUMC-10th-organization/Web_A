// 메뉴 아이콘 컴포넌트
const MenuIcon = ({ isOpen }: { isOpen: boolean }) => {
  const barBase = "block w-full h-0.5 bg-white rounded-full duration-300";

  return (
    <>
      <span className={`${barBase} origin-left transition-transform ${isOpen ? "rotate-[45deg]" : ""}`} />
      <span className={`${barBase} transition-opacity ${isOpen ? "opacity-0" : ""}`} />
      <span className={`${barBase} origin-left transition-transform ${isOpen ? "-rotate-[45deg]" : ""}`} />
    </>
  );
};

export default MenuIcon;
