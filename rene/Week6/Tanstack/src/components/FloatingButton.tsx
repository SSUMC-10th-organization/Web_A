import plusIcon from "../assets/plus-icon.svg";

const FloatingButton = () => {
  return (
    <button
      className="fixed bottom-8 right-8 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-xl hover:bg-pink-600 active:scale-95 transition-all z-50"
      aria-label="엘피 추가"
    >
      <img src={plusIcon} alt="추가" className="w-6 h-6" />
    </button>
  );
};

export default FloatingButton;
