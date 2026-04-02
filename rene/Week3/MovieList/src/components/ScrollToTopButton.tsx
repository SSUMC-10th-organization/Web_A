import { useEffect, useState } from "react";
import ChevronIcon from "../assets/chevron-icon.svg";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    
    return () => window.removeEventListener("scroll", onScroll); // 클린업
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-10 right-10 z-50 bg-white/10 hover:bg-white/20 
      text-white w-16 h-16 rounded-full flex items-center justify-center text-lg transition-colors"
      aria-label="맨 위로"
    >
      <img src={ChevronIcon} alt="위로" className="w-9 h-9" />
    </button>
  );
};

export default ScrollToTopButton;
